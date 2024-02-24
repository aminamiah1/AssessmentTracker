# Table of Contents

- [Local development](#local-development)
  - [PostgreSQL](#postgresql)
  - [Database migrations](#database-migrations)
    - [Dangerous migrations](#dangerous-migrations)
- [CI/CD](#cicd)
  - [Development](#development)
    - [Pipeline Summary](#development-pipeline-summary)
  - [Staging](#staging)
    - [Pipeline Summary](#staging-pipeline-summary)
  - [Production](#production)
    - [Pipeline Summary](#production-pipeline-summary)
  - [Important links](#important-links)
- [Cypress](#cypress)
- [Contributing](#contributing)

# Local development

To get started with local development, you'll need to set up a database for testing. PostgreSQL is our chosen DBMS.

## PostgreSQL

To start up a Postgres DB, you want to open up the `pgAdmin` app installed on your device - you can install it [from here](https://www.pgadmin.org/) if you don't have it on your device. NSA laptops should come with it pre-installed.

First-time setup should prompt you to set a master password.

To set up a new database, you'll want to:

- Navigate to the `Browser`
- Expand the `Servers` tab
- Click on `PostgreSQL 15` (or whatever your version may be)
  - This should prompt you for a sign-in. The default DB username and password should both be `postgres`
- You should then be able to right-click the server in the `Browser` tab, and:
  - OPTIONAL: `Create > Login/Group Role...`
    - Follow the steps to create a "safe" user to interact with the database
    - However, because this is just local testing, you should be OK to carry on with the default `postgres` DB superuser
  - REQUIRED: `Create > Database...`
    - Fill in a database name in the `Database` field
    - Select a different `Owner` if you followed the previous optional step
    - Click `Save` - the default parameters should be good enough

The connection string for this DB should be:  
`postgres://user:pass@localhost/db-name`

So for example, if the default `postgres` superuser was chosen as the Owner of the database, and the DB port wasn't changed, and the DB's name is `test-db`, the connection string should be:  
`postgres://postgres:postgres@localhost/test-db`

This is the string you want to put into your `.env` file:

```env
DATABASE_URL=postgres://postgres:postgres@localhost/test-db
```

## Database Migrations

Database migrations are vital for source control and maintaining a healthy production-ready app. We could do as much planning as possible at the start, but it's inevitable that some schema changes will be made at some point down the line. Thankfully, [Prisma offers fantastic support](https://www.prisma.io/docs/orm/prisma-migrate) for database migrations.

If the branch you're working on has resulted in a `schema.prisma` change, then run:

```
$ npx prisma migrate dev
```

And this will prompt you to enter a name for the migration (e.g. changed field type).

You can bypass this prompt by passing in the migration name as an argument:

```
$ npx prisma migrate dev --name changed-field-type
```

### Dangerous migrations

Some migrations are [explained in the official Prisma docs](https://www.prisma.io/docs/orm/prisma-migrate/workflows/customizing-migrations) as having to be "customised" before being applied. "Dangerous" is a good label for these migrations, as they're migrations that may result in data loss - something we want to avoid in production!

# CI/CD

The infrastructure for this project is as follows:

- Docker
- GitLab CI
- OpenShift

There are three main categories which the CI/CD can be split into:

- [Development](#development)
  - This is relating to any non-`main` and non-`release-*` branches
- [Staging](#staging)
  - This is relating _only_ to `release-*` branches
- [Production](#production)
  - This is relating to the `main` branch

## Development

The build, any artifacts, and all tests exist only within GitLab's CI. No deployment occurs, and no interaction is made with OpenShift or other external services.

The build stage runs a [clean install](https://docs.npmjs.com/cli/v6/commands/npm-ci) - this is recommended in automated environments, because it ensures that the `package-lock.json` and the `package.json` are in sync, and no version mismatches exist. It would be up to the developer to fix the versions locally, and push up the fix again.

Build artifacts are generated in a `.next` directory, which are then used as a dependency in the `test` stage. A postgres service is started up, which will serve as a clean slate for the app to generate its schema and use for testing. In the event of failed tests, Cypress' screenshots and videos will be made into an artifact for the developer's sake.

### Development Pipeline Summary

- Build the app in a GitLab runner
  - Save the `.next` build artifacts (stored for 30 days by default)
- Test the app in a GitLab runner
  - In the event of a failed test, all screenshots captured by Cypress will be available in the job artifacts (stored for 90 days by default)

## Staging

The build takes place in OpenShift, with a BuildConfig being dynamically generated by a pre-defined template. Templates have been used to allow dynamic tagging of images - tags here are determined by a combination of the release branch and the [commit's short SHA](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html).

- A semantic, human-readable section has been provided as the first half of the tag, for the sake of being able to see at a glance which release a tag belonged to
- The commit's short SHA was chosen as a unique identifier to prevent images overwriting one another unintentionally

Before the BuildConfig takes place, a check is put in place to see if the `schema.prisma` was changed, or a new `migration` was created. If this is the case, a snapshot of the persistant volume claim should be made - a backup of the database. Instead, permission errors were encountered, and `pg_basebackup` was used instead.

The BuildConfig outputs the image to [this GitLab repo's container registry](https://git.cardiff.ac.uk/c21063494/assessmenttracking/container_registry), making it available for use in pipelines - this was a workaround, as we don't have direct access to `Image` resources from OpenShift.

The testing will then occur in GitLab's CI - using the newly created image as a service (as it's exposing port 3000), along with [postgres](https://hub.docker.com/_/postgres), and running [Cypress](https://hub.docker.com/r/cypress/base) as the base image for the container for testing purposes.

An artifact will be generated at the end of the test stage, containing a folder with any screenshots and videos generated by Cypress for failed tests - this will also result in the pipeline's failure.

If the testing stage is successful, a pre-deployment script will run, which will point a `:latest` label at the newly created staging image. This is the image which will be grabbed in the next stage.

In deployment, OpenShift will execute a pre-configured deployment config, which pulls the `:latest` staging image, and hosts it in a container exposed for a predetermined URL to serve to visitors.

### Staging Pipeline Summary

- Two simultaneous builds start
  - One in a GitLab runner, same as the [development pipeline](#development-pipeline-summary)
  - One in OpenShift
    - The GitLab runner is able to wait on the OpenShift build, following all logs and streaming to the stdout and stderr
    - Once finished, the Docker image is then pushed to [this repo's container registry](https://git.cardiff.ac.uk/c21063494/assessmenttracking/container_registry) with the commit's short SHA as the tag
- A cleanup stage then starts for the OpenShift build
  - The temporary BuildConfig generated by the template now needs to be deleted (just to reduce clutter in OpenShift)
- The test stage executes on the GitLab's build artifact, same as the [development pipeline](#development-pipeline-summary)
- The deployment preparation stage starts in parallel
  - A Database backup is created for the staging Database
    - This Database is then downloaded to the GitLab runner and saved as an artifact (30 days by default)
  - The image's tag in the registry is updated to `:latest`, maintaining the initial commit-specific tag
- The deployment command is sent to OpenShift when the preparation stage is finished
  - This will pull the `:latest` tag from the container registry and spin up a container to expose on the [staging URL](https://assessment-tracker-staging-assessment-tracker.apps.openshift.cs.cf.ac.uk/)

## Production

See [staging](#staging) setup (Will fill this in at some point)

### Production Pipeline Summary

- Two simultaneous builds start
  - One in a GitLab runner, same as the [development pipeline](#development-pipeline-summary)
  - One in OpenShift
    - The GitLab runner is able to wait on the OpenShift build, following all logs and streaming to the stdout and stderr
    - Once finished, the Docker image is then pushed to [this repo's container registry](https://git.cardiff.ac.uk/c21063494/assessmenttracking/container_registry) with the commit's short SHA as the tag (this should ideally be changed to a timestamp tag in the future)
- A cleanup stage then starts for the OpenShift build
  - The temporary BuildConfig generated by the template now needs to be deleted (just to reduce clutter in OpenShift)
- The test stage executes on the GitLab's build artifact, same as the [development pipeline](#development-pipeline-summary)
- The deployment preparation stage starts in parallel
  - A Database backup is created for the staging Database
    - This Database is then downloaded to the GitLab runner and saved as an artifact (30 days by default)
  - The image's tag in the registry is updated to `:stable`, maintaining the initial commit-specific tag
- The deployment command is sent to OpenShift when the preparation stage is finished
  - This will pull the `:stable` tag from the container registry and spin up a container to expose on the [staging URL](https://assessment-tracker-prod-assessment-tracker.apps.openshift.cs.cf.ac.uk/)

## Important links

- [Husky in CI](https://typicode.github.io/husky/how-to.html#ci-server-and-docker)
  - To prevent husky from installing in a CI or Docker environment

# Cypress

To start using the Cypress GUI, run:

`npm run cy:open`

## Useful Commands

Others may be added as more tests are added.

`npm run test:e2e`
`npm run coverage:e2e`

If you plan to add any different paths for whatever reason inside the cypress folder, be sure to update the .gitlab-ci.yml and npm run test:all script in package.json as well with the updated tests so that we know all tests are running.

## Contributing

This project uses ESLint, Editorconfig, and Prettier, in conjunction with Husky;

- [ESLint](https://eslint.org/) for analysing issues with code, such as unused variables
- [Editorconfig](https://editorconfig.org/) to let developer experiences with code formatting [stay consistent across many different IDEs](https://editorconfig.org/#pre-installed), regardless of formatters
- [Prettier](https://prettier.io/) for formatting code - max line lengths, no tabs+spaces mixed, keyword spacing
- [Husky](https://github.com/typicode/husky) to enable formatting to occur to all files before committing to git

## Integrate with your tools

- [ ] [Set up project integrations](https://git.cardiff.ac.uk/c21063494/assessmenttracking/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

## Name

Choose a self-explaining name for your project.

## Description

Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges

On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals

Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation

Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage

Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support

Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap

If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing

State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment

Show your appreciation to those who have contributed to the project.

## License

For open source projects, say how it is licensed.

## Project status

If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.

## Prisma database set up

Create a new .env file in the cloned root repository and place the string DATABASE_URL="OUR_CLOUD_DB_STRING_PROVIDED_TO_YOU" and in your terminal from root, please execute the following "npx prisma generate" first to generate the schema and create ERD and then "npx prisma db pull" to pull latest database changes, you can then go ahead and execute "npm run dev" to launch the app in dev server and the data should load for you.

## API Documentation

## PS Team

# Get All Users(GET)

To get all users the ps team can use the api located at localhost:3000/api/ps-team/get-users to retrieve all users

# Get User(GET)

To get a specific user by id, the ps team can use the api located at localhost:3000/api/ps-team/get-user?id=0(example) and pass details in the request query

# Edit User(POST)

To edit a specific user by id, the ps team can use the api located at localhost:3000/api/ps-team/edit-users and pass details in the request body

# Delete User(DELETE)

To delete a specific user by id, the ps team can use the api located at localhost:3000/api/ps-team/delete-user and pass details in the request body

# Create User(POST)

To create a user, the ps team can use the api located at localhost:3000/api/ps-team/get-user and pass details in the request body

## Page Documentation

## PS Team

# User management dashboard

Located at localhost:3000/ps-team/user-management, the ps team can add, edit, delete or view all users in a nicely-presented crud operation table with pop-up forms for editing and adding new users.

## Module leaders

# Assessment management dashboard

On the module-leader assessment management dashboard (localhost:3000/module-leader/assessment-management), module leader members can view individual assessments in responsive stacked cards. They may create new assessments using a dedicated form, with both actions accessible via clearly labeled dashboard buttons. Additionally, the 'View All Assessments' page enables editing and deleting of assessments through buttons integrated into each card.

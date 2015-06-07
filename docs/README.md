## Preface

Here I tried to illustrate my current approach when developing
an AJAX-driven Web Application in general.

I left the point for backend c) part aside, as it would be just
a Facade class(es?) in front of existing Repositories and Entities,
and containing additional validation for API consumer convenience.

Current demo nas **NO VALIDATION, and NO ERROR HANDLING**.

The project itself is called **uman**, just to have a namespace.

Live Demo:

 * local in-memory version: [http://demo.pluseq.com/uman/](http://demo.pluseq.com/uman/)
 * same with remote backend: [http://demo.pluseq.com/uman/?remote](http://demo.pluseq.com/uman/?remote)

The local version doesn't persist on purpose. It's easy to implemt
it though, since all entities have serialize/unserialize
methods.

## Development Steps

1. Rough design of the class structure
2. Design HTML + Knockout ViewModel with stubs
3. Implement local Storages, and making sure the application
   is usabel in this shape
4. Implement backend side
5. Replace LocalStorages on client side with a RemoteStorage,
    and test again

## Class and DB Structure

The front-end and backend (as usual) have similar object models.
I used colors on the diagram to highlight the similarity.

see [diagram](https://github.com/disjunction/uman/blob/master/docs/class_diagram.png)

Users and Groups have simple Many-To-Many relation with the
possibility to have no link on either of the sides.
So the DB schema is just 2 Entity tables with a link table.
The definition is quite obvious from [User.php](https://github.com/disjunction/uman/blob/master/backend-silex/src/Entity/User.php)

Repository classes on the Frontend are called Storages,
but essentially they implement a Repository pattern.

By coincidence the front-end RemoteStorage has nothing
special for Users compared to Groups, that's why the same
class is used, just different constructor params.

## Libraries and components

### Frontend

The **HTML** is just a static file, as all is done via AJAX.
It's rather big, but I left in in one piece on intention,
to make it more readable.

Styling is done using **Bootstrap**, just because it's so easy
and looks nice out of the box. Also the page seems to be quite
responsive regarding the size changes without any extra efforts.

An only additional UI component is a **boostrap-multiselect**.
(Used for group selection in user edit dialog)

The frontend application uses MVVM framework **knockout.js**,
selected for it's simplicity as opposed to Angular or Backbone.

DOM manipulations and AJAX are done directly using **jQuery**,
as it's common when using knockout.

The JS model part is implemented as **node.js** complient
modules. The benefit here is a clean modular framework,
strict JS-linting, and the ability to reuse any of the
classes on server side, e.g. in test automation.

The final JS is generated using **browserify** tool.
In `entry.js` all required classes are structured in
a simple package exported to global scope as "uman",
thus avoiding to do requires from global scope.

The model is partially covered with **Jasmine** tests.

Micro-continous integration is done with a **grunt**.
On each file-change in `src` or `spec` it recompiles
the the whole source with browserify, and runs the Jasmine
tests. This way I can instantly see I'm breaking something.

All libraries needed for development are installed using *npm*

### Backend

As the whole task for the backend is just provinding
a RESTful JSON API, there is no need to use any big frameworks.
(And in real life it's also often the case, that dynamic
complete page generation is not needed).

So I selected a tiny framework I'm familiar with - **silex**,
created by original author of Symfony, thus easily taking
advantage of all Symfony components, but not having any overhead.

The main application is just one file `UmanSilexApp.php`,
The route definitions give a good picture of supported methods.
In general there are `/users` and `/groups` endpoints,
proving GET, POST and DELETE methods.

I took **SQLite** DB as the easiest for deployment.

Negotiation with DB is done using **Doctrine** ORM. Not that it's
so much needed for this task, but to have at least something on
the backend side.

The functionality is scaresly covered with **PHPUnit** unittests.
It's more an integration and development helper than a test,
just aiding me to check the functionality.

All libraries needed for deployemnt and development
are installed using *composer*

## Running application

The frontend should run out of the box.
Just open `frontend/www/index.html`

### Backend setup

Requirement:

 * [composer](https://getcomposer.org/)
 * php-sqlite (debian: `sudo apt-get install php5-sqlite`)
 * by default server runs on port 8000, so make sure it's not taken

Setup steps:

    cd backend-silex
    composer install
    ./run-server.sh

Optionally you can reset the DB:

    ./reset-db.sh

DB file can be accessed directly:

    sqlite3 uman.sqlite


### JS developer setup

If there was another developer, he would foollow this

    npm install -g grunt-cli # if not installed
    cd frontend
    npm install

Common tasks:

    grunt browserify             # generates www/build/uman.js
    grunt grunt jasmine-verbose  # run unit-tests
    grunt watch                  # watches changes, and does both of above on change


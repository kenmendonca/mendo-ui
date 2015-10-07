# mendo-ui 
Mendo-ui is a tool to build websites with AngularJS through the use of a component library.

It comes packaged with a **Scaffold Editor** to set up the pages, a **ComponentForm** to preview the pages, and dynamic **Documentation**.

To get started, install nodejs, clone *mendo-ui* and cd into the *mendo-ui* directory.

	npm install
	node server.js

The server defaults to port 8080, which can be changed in the *server.js* file. The url to the **Scaffold Editor** is: [http://localhost:8080/Scaffolder](http://localhost:8080/Scaffolder) and the url to the **Documentation** is: [http://localhost:8080/Documentation](http://localhost:8080/Documentation)

If you are adding to the component library, then use the command `grunt --gruntfile=gruntfile.dev.js` which tracks and compiles changes. 

	
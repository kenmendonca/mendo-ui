#Editor
The Scaffold Editor has three parts: **File Explorer**, **Build**, and **Preview**. 
##File Explorer
The **File Explorer** displays what is in the `configFiles` directory via the **Filesystem** section, and any files can be previewed in the **File preview** window.

Under **Choose a directory**, any chosen directory can be *edited*, *forked*, or *removed*. You also have the option to create a new directory.

If for some reason your browser crashed while you were in the middle of an session, or you have unsaved changes, you have the ability to edit those sessions or remove them from memory, as shown by **Previously Unsaved Sessions** on the bottom right corner. The sessions are saved to **localStorage**, which means that if you clear your browser history or edit in an incognito window, then your unsaved data will not show up.
##Build
On the left hand side of the builder, we have **Pages** which lists the pages in the directory, with the option to add pages using the **+ Page** as needed. A new page has both a **title** and a **stateName**. Underneath the **Pages** we have a direct JSON editor, in which we can **Select All** for copying purposes or **Edit** to edit the JSON directly. Be sure to click the **Edit** button again when done editing. 

The page is scaffolded using Bootstrap, which uses a system of rows and columns, which can have a width of 1 - 12. The light blue icons that show upon hovering over a row are used for editing the row: rows can be added, removed, moved up or down, and can have classes added to them through the buttons. The white icons that show upon hovering over a column are used for editing the column: columns can be split into two, an additional row can be added within a column, columns can be removed, moved left or right, and can have classes added to them through the buttons.

Each cell can contain any amount of components, which can be added by clicking the **+ puzzle** button. A lightbox pops up with components to select from and upon clicking **Next**, one can edit the form fields on the left of the lightbox with a live preview on the right, clicking **Add Component** to add it to the particular cell or either clicking out of the lightbox or pressing the **x** in the corner to exit.

It is reccommended to periodically **Save**, which is available on the left hand side, which saves files to the filesystem. When finished, clicking **Export** will provide the user with a zipped file containing:

	build.{PageTitle}.mendo-ui.css
	build.{PageTitle}.mendo-ui.js
	config.json
	index.html
	Page(s).json
	Page(s)Controller.js

The **index.html** file will contain mocked paths to the required files.

##Preview
You can preview your work in the dimensions of either a *laptop*, *tablet*, or *phone*, or you can customize the layout. You also have the option to preview it in a new window.

# RouteJs
**Current Version: 1.0**

A simple Single Page Application(SPA) front-end/JavaScript  library .

You just have to have basic understanding of JavaScript that's it.

Free for **personal/commercial** use (MIT licence).
## How to install
CDN
```html
<script src="https://cdn.jsdelivr.net/gh/joydeep11/routeJs/main/js/route-1.0.js"></script>
```
**or** you can find the main js file inside main/js folder.(Always choose the latest version)
## What's inside?
A single class containing a router, and some other functions enough to build a SPA website. 
## Documentation
### .htaccess
```apacheconf
RewriteEngine On
# Don't rewrite files or directories
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
# Rewrite everything else to index.html 
RewriteRule ^ index.html [L]
```
Place this in your.htaccess and keep index.html and .htaccess in the same directory.
Now in your index.html file:
### Declare

```javascript
const router=new route();
```
### Initialization
```javascript
//Default for all links 
router.init();
//or
//for specific  links only
router.init({
link: 'a[rel="spa"]'
});
//or
//disable SPA on DOMContentLoaded for server side rendering and seo purposes
router.init({
link: 'a[rel="spa"]',
onDOMLoaded:false
});
```
### Get url
```javascript
router.get("/home",function(){
	//do staffs
});

```
### Dynamic url
```javascript
router.get("/post/{id}/{slug}",function(param){
	var id=param.id;
	var slug=param.slug;
	console.log(param)
});
```
### Get querystring
```javascript
//for /search?q=something&catagory=something

router.get("/search",function(){
if(router.getQueryParams()){
	const param=router.getQueryParams();
	var q=param.q;
	var catagory=param.catagory;
	console.log(param)
}
});
```
### View 
```javascript
router.view(html,parameters={});
```
#### Example
```javascript
function welcome(){
	return(`<h1>Hello {{username}}</h1>`);
}
var wlc=router.view(welcome(),{
	username: "Joydeep"
});
```
**will return :**
```html
<h1>Hello Joydeep</h1>
```
### Bind events on dynamically generated html

```javascript
router.live(selector, evt, callback);
```
#### Example
```javascript
router.live(".btn","click",function(){
	alert("clicked");
});
```







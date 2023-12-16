const loader = new THREE.OBJLoader();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x000000, 0 ); // the default

document.body.appendChild( renderer.domElement );

//var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//var cube = new THREE.Mesh( geometry, material );
//scene.add( cube );
var watch_obj;

// load a resource
loader.load(
	// resource URL
	'/watch-003.obj',
	// called when resource is loaded
	function ( object ) {
        
        for (var i = 0; i < object.children.length; i++) {
            object.children[i].material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        }
        console.log(object.children.length);
//        object.children[0].material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//        object.children[1].material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//        object.children[2].material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//        object.children[3].material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//        object.children[4].material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//        object.children[5].material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        
        object.scale.set(30,30,30)
        watch_obj = object;
		scene.add( object );

	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);


camera.position.z = 5;

var animate = function () {
	requestAnimationFrame( animate );

	watch_obj.rotation.x += 0.1;
	watch_obj.rotation.y += 0.1;

	renderer.render(scene, camera);
};

animate();
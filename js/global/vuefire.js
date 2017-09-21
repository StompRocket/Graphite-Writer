(function webpackUniversalModuleDefinition(root,factory){if(typeof exports==='object'&&typeof module==='object')module.exports=factory();else if(typeof define==='function'&&define.amd)define([],factory);else if(typeof exports==='object')exports["VueFire"]=factory();else
root["VueFire"]=factory();})(this,function(){return(function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:false};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.loaded=true;return module.exports;}__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.p="";return __webpack_require__(0);})([function(module,exports){var Vue
function _getKey(snapshot){return typeof snapshot.key==='function'?snapshot.key():snapshot.key}function _getRef(refOrQuery){if(typeof refOrQuery.ref==='function'){refOrQuery=refOrQuery.ref()}else if(typeof refOrQuery.ref==='object'){refOrQuery=refOrQuery.ref}return refOrQuery}function isObject(val){return Object.prototype.toString.call(val)==='[object Object]'}function createRecord(snapshot){var value=snapshot.val()
var res=isObject(value)?value:{'.value':value}
res['.key']=_getKey(snapshot)
return res}function indexForKey(array,key){for(var i=0;i<array.length;i++){if(array[i]['.key']===key){return i}}return-1}function bind(vm,key,source){var asObject=false
var cancelCallback=null
var readyCallback=null
if(isObject(source)&&source.hasOwnProperty('source')){asObject=source.asObject
cancelCallback=source.cancelCallback
readyCallback=source.readyCallback
source=source.source}if(!isObject(source)){throw new Error('VueFire: invalid Firebase binding source.')}var ref=_getRef(source)
vm.$firebaseRefs[key]=ref
vm._firebaseSources[key]=source
if(asObject){bindAsObject(vm,key,source,cancelCallback)}else{bindAsArray(vm,key,source,cancelCallback)}if(readyCallback){source.once('value',readyCallback.bind(vm))}}function defineReactive(vm,key,val){if(key in vm){vm[key]=val}else{Vue.util.defineReactive(vm,key,val)}}function bindAsArray(vm,key,source,cancelCallback){var array=[]
defineReactive(vm,key,array)
var onAdd=source.on('child_added',function(snapshot,prevKey){var index=prevKey?indexForKey(array,prevKey)+1:0
array.splice(index,0,createRecord(snapshot))},cancelCallback)
var onRemove=source.on('child_removed',function(snapshot){var index=indexForKey(array,_getKey(snapshot))
array.splice(index,1)},cancelCallback)
var onChange=source.on('child_changed',function(snapshot){var index=indexForKey(array,_getKey(snapshot))
array.splice(index,1,createRecord(snapshot))},cancelCallback)
var onMove=source.on('child_moved',function(snapshot,prevKey){var index=indexForKey(array,_getKey(snapshot))
var record=array.splice(index,1)[0]
var newIndex=prevKey?indexForKey(array,prevKey)+1:0
array.splice(newIndex,0,record)},cancelCallback)
vm._firebaseListeners[key]={child_added:onAdd,child_removed:onRemove,child_changed:onChange,child_moved:onMove}}function bindAsObject(vm,key,source,cancelCallback){defineReactive(vm,key,{})
var cb=source.on('value',function(snapshot){vm[key]=createRecord(snapshot)},cancelCallback)
vm._firebaseListeners[key]={value:cb}}function unbind(vm,key){var source=vm._firebaseSources&&vm._firebaseSources[key]
if(!source){throw new Error('VueFire: unbind failed: "'+key+'" is not bound to '+'a Firebase reference.')}var listeners=vm._firebaseListeners[key]
for(var event in listeners){source.off(event,listeners[event])}vm[key]=null
vm.$firebaseRefs[key]=null
vm._firebaseSources[key]=null
vm._firebaseListeners[key]=null}function ensureRefs(vm){if(!vm.$firebaseRefs){vm.$firebaseRefs=Object.create(null)
vm._firebaseSources=Object.create(null)
vm._firebaseListeners=Object.create(null)}}var init=function(){var bindings=this.$options.firebase
if(typeof bindings==='function')bindings=bindings.call(this)
if(!bindings)return
ensureRefs(this)
for(var key in bindings){bind(this,key,bindings[key])}}
var VueFireMixin={created:init,beforeDestroy:function(){if(!this.$firebaseRefs)return
for(var key in this.$firebaseRefs){if(this.$firebaseRefs[key]){this.$unbind(key)}}this.$firebaseRefs=null
this._firebaseSources=null
this._firebaseListeners=null}}
function install(_Vue){Vue=_Vue
Vue.mixin(VueFireMixin)
var mergeStrats=Vue.config.optionMergeStrategies
mergeStrats.firebase=mergeStrats.methods
Vue.prototype.$bindAsObject=function(key,source,cancelCallback,readyCallback){ensureRefs(this)
bind(this,key,{source:source,asObject:true,cancelCallback:cancelCallback,readyCallback:readyCallback})}
Vue.prototype.$bindAsArray=function(key,source,cancelCallback,readyCallback){ensureRefs(this)
bind(this,key,{source:source,cancelCallback:cancelCallback,readyCallback:readyCallback})}
Vue.prototype.$unbind=function(key){unbind(this,key)}}if(typeof window!=='undefined'&&window.Vue){install(window.Vue)}module.exports=install}])});;
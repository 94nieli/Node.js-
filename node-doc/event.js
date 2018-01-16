2 events - 事件
	大多数Node.js核心API都采用惯用的异步事件驱动架构，其中某些类型的对象（触发器）会周期性的触发命名事件来调用函数对象（监听器）

	例如，net.Server对象会在每次有新连接时触发事件 fs.ReadStream 会在文件被打开时触发事件;流对象会在数据可读时触发事件。

	所有能触发事件的对象都是EventEmitter类的实例。这些对象开放了一个eventEmitter.on()函数允许将一个或者多个函数绑定到会被对象触发的命名条件上。事件名称通常是驼峰式的字符串，但也可以使用任何有效的JS属性名。

	当EventEmitter对象触发一个事件时，所有绑定在该事件上的函数都能被同步的调用。监听器的返回值会被丢弃。

	例子，一个绑定了一个监听器的EventEmitter实例。eventEmitter.on()方法用于注册监听器。eventEmitter.emit()方法用于触发事件。

	const EventEmitter = require('events');

	class MyEmitter extends EventEmitter {}

	const myEmitter = new MyEmitter();
	myEmitter.on('event', () => {
	  console.log('触发了一个事件！');
	});
	myEmitter.emit('event');
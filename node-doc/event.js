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



	给监听器传入参数与this
		eventEmitter.emit()方法允许将任意参数传给监听器函数。当一个普通的监听器函数被EventEmitter调用时，
		标准的this关键词会被设置只想监听器所附加的EventEmitter

		const myEmitter = new MyEmitter();
		myEmitter.on('event', function(a, b) {
		  console.log(a, b, this);
		  // 打印:
		  //   a b MyEmitter {
		  //     domain: null,
		  //     _events: { event: [Function] },
		  //     _eventsCount: 1,
		  //     _maxListeners: undefined }
		});
		myEmitter.emit('event', 'a', 'b');

		也可以使用 ES6 的箭头函数作为监听器。但是这样 this 关键词就不再指向 EventEmitter 实例：

		const myEmitter = new MyEmitter();
		myEmitter.on('event', (a, b) => {
		  console.log(a, b, this);
		  // 打印: a b {}
		});
		myEmitter.emit('event', 'a', 'b');


	异步与同步
		EventListener会按照监听器注册的顺序同步地调用所有监听器。所以需要确保事件的正确排序切避免竞争条件
	  或者逻辑错误。监听器函数可以使用 setImmediate() 或者 process.nextTick()方法切换到异步操作模式
	  const myEmitter = new MyEmitter();
		myEmitter.on('event', (a, b) => {
		  setImmediate(() => {
		    console.log('这个是异步发生的');
		  });
		});
		myEmitter.emit('event', 'a', 'b');


	只处理事件一次

		当使用 eventEmitter.on() 方法注册监听器时，监听器会在每次触发命名事件时被调用。

		const myEmitter = new MyEmitter();
		let m = 0;
		myEmitter.on('event', () => {
		  console.log(++m);
		});
		myEmitter.emit('event');
		// 打印: 1
		myEmitter.emit('event');
		// 打印: 2


	错误事件


		当 EventEmitter 实例中发生错误时，会触发一个 'error' 事件。 这在 Node.js 中是特殊情况。

		如果 EventEmitter 没有为 'error' 事件注册至少一个监听器，则当 'error' 事件触发时，会抛出错误、打印堆栈跟踪、且退出 Node.js 进程。

		const myEmitter = new MyEmitter();
		myEmitter.emit('error', new Error('whoops!'));
		// 抛出错误，并使 Node.js 崩溃
		为了防止 Node.js 进程崩溃，可以在 process 对象的 uncaughtException 事件上注册监听器，或使用 domain 模块。 （注意，domain 模块已被废弃。）

		const myEmitter = new MyEmitter();

		process.on('uncaughtException', (err) => {
		  console.error('有错误');
		});

		myEmitter.emit('error', new Error('whoops!'));
		// 打印: 有错误
		作为最佳实践，应该始终为 'error' 事件注册监听器。

		const myEmitter = new MyEmitter();
		myEmitter.on('error', (err) => {
		  console.error('有错误');
		});
		myEmitter.emit('error', new Error('whoops!'));
		// 打印: 有错误


	EventEmitter类

		EventEmitter 类由 events 模块定义和开放的：

		const EventEmitter = require('events');
		当新的监听器被添加时，所有的 EventEmitter 会触发 'newListener' 事件；
		当移除已存在的监听器时，则触发 'removeListener'。

		newListener 事件
			EventEmitter 实例会在一个监听器被添加到其内部监听器数组之前触发自身的 'newListener' 事件。

			注册了 'newListener' 事件的监听器会传入事件名与被添加的监听器的引用。

			事实上，在添加监听器之前触发事件有一个微妙但重要的副作用： 在'newListener' 回调函数中, 一个监听器的名字如果和已有监听器名称相同, 则在被插入到EventEmitter实例的内部监听器数组时, 该监听器会被添加到其它同名监听器的前面。

			const myEmitter = new MyEmitter();
			// 只处理一次，所以不会无限循环
			myEmitter.once('newListener', (event, listener) => {
			  if (event === 'event') {
			    // 在开头插入一个新的监听器
			    myEmitter.on('event', () => {
			      console.log('B');
			    });
			  }
			});
			myEmitter.on('event', () => {
			  console.log('A');
			});
			myEmitter.emit('event');
			// 打印:
			//   B
			//   A


		removeListener 事件

			removeListener事件在Listener被移除后触发


		EventEmitter.listenerCount(emitter, eventName)

			新增于: v0.9.12 废弃于: v4.0.0
			稳定性: 0 - 废弃的: 使用 emitter.listenerCount() 代替。
			A class method that returns the number of listeners for the given eventName registered on the given emitter.

			const myEmitter = new MyEmitter();
			myEmitter.on('event', () => {});
			myEmitter.on('event', () => {});
			console.log(EventEmitter.listenerCount(myEmitter, 'event'));
			// Prints: 2

		EventEmitter.defaultMaxListeners


			新增于: v0.11.2
			每个事件默认可以注册最多 10 个监听器。 单个 EventEmitter 实例的限制可以使用 emitter.setMaxListeners(n) 方法改变。 所有 EventEmitter 实例的默认值可以使用 EventEmitter.defaultMaxListeners 属性改变。 如果这个值不是正数, 那将抛出 TypeError错误.

			设置 EventEmitter.defaultMaxListeners 要谨慎，因为会影响所有 EventEmitter 实例，包括之前创建的。 因而，调用 emitter.setMaxListeners(n) 优先于 EventEmitter.defaultMaxListeners。

			注意，这不是一个硬性限制。 EventEmitter 实例允许添加更多的监听器，但会向 stderr 输出跟踪警告，表明检测到一个可能的 EventEmitter 内存泄漏。 对于任何单个 EventEmitter 实例，emitter.getMaxListeners() 和 emitter.setMaxListeners() 方法可用于暂时地消除此警告：

			emitter.setMaxListeners(emitter.getMaxListeners() + 1);
			emitter.once('event', () => {
			  // 做些操作
			  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
			});
			--trace-warnings 命令行标志可用于显示此类警告的堆栈跟踪。

			触发的警告可以使用 process.on('warning') 检查，还有额外的 emitter、type 和 count 属性，分别代表事件触发器实例的引用、事件的名称、和附加的监听器的数量。


		emitter.addListener(eventName, listener) 

			emitter.on(eventName, listener) 的别名。


		emitter.emit(eventName[, ...args])

			按监听器的注册顺序，同步地调用每个注册到名为 eventName 事件的监听器，并传入提供的参数。

			如果事件有监听器，则返回 true ，否则返回 false。


		emitter.eventNames()

			新增于: v6.0.0
			返回一个列出触发器已注册监听器的事件的数组。 数组中的值为字符串或符号。

			const EventEmitter = require('events');
			const myEE = new EventEmitter();
			myEE.on('foo', () => {});
			myEE.on('bar', () => {});

			const sym = Symbol('symbol');
			myEE.on(sym, () => {});

			console.log(myEE.eventNames());
			// 打印: [ 'foo', 'bar', Symbol(symbol) ]


		emitter.getMaxListeners()

			新增于: v1.0.0
			返回 EventEmitter 当前的最大监听器限制值，该值可以通过 emitter.setMaxListeners(n) 设置
			或默认为 EventEmitter.defaultMaxListeners。


		emitter.listenerCount(eventName)

			新增于: v3.2.0
			eventName <any> 正在被监听的事件名
			返回正在监听名为 eventName 的事件的监听器的数量


		emitter.listeners(eventName)

			eventName <any>
			返回名为 eventName 的事件的监听器数组的副本。

			server.on('connection', (stream) => {
			  console.log('someone connected!');
			});
			console.log(util.inspect(server.listeners('connection')));
			// 打印: [ [Function] ]


		
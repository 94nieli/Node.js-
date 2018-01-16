1 assert - 断言  assert模块提供了断言测试的函数 用于测试不变式

	1-1 assert(value[,message])    assert.ok()的别名

	1-2 assert.deepEqual(actual,expected[,message])

				测试actual和expected参数是否深度相等 原始值使用相等运算符 == 比较

				只测试可枚举类型，不测试对象的原型 连接符 或者不可枚举的属性 （这些情况使用assert,deepStrictEqual()）
				例如 下面的例子不会抛出AssertionError 因为REGEXP对象的属性不是可枚举的

				assert.deepEqual(/a/gi,new Date())

				map 和 set包含的子项也会被测试

				子对象中可枚举的自身属性也会被测试：
				const assert = require('assert');

				const obj1 = {
				  a: {
				    b: 1
				  }
				};
				const obj2 = {
				  a: {
				    b: 2
				  }
				};
				const obj3 = {
				  a: {
				    b: 1
				  }
				};
				const obj4 = Object.create(obj1);

				assert.deepEqual(obj1, obj1);
				// 测试通过，对象与自身相等。

				assert.deepEqual(obj1, obj2);
				// 抛出 AssertionError: { a: { b: 1 } } deepEqual { a: { b: 2 } }
				// 因为 b 属性的值不同。

				assert.deepEqual(obj1, obj3);
				// 测试通过，两个对象相等。

				assert.deepEqual(obj1, obj4);
				// 抛出 AssertionError: { a: { b: 1 } } deepEqual {}
				// 因为不测试原型。

				如果两个值不相等 则派出一个带有message属性的AssertError 其中message属性的值等于传入的
				message参数的值 如果message参数为undefined 则赋值默认的错误信息


	1-3 assert.deepStrictEqual(actual,expected[,message])
			跟deepEqual大致相同 但有一些区别：

			1.原始值使用全等运算符 === 比较 set的值与map的键 使用SameValueZero比较
			2.对象的原型也是用全等运算符比较
			3.对象的类型标签要求相同
			4.比较[对象包装器]时 其对象和里面的值要求相同

			const assert = require('assert');

			assert.deepEqual({ a: 1 }, { a: '1' });
			// 测试通过，因为 1 == '1'。

			assert.deepStrictEqual({ a: 1 }, { a: '1' });
			// 抛出 AssertionError: { a: 1 } deepStrictEqual { a: '1' }
			// 因为使用全等运算符 1 !== '1'。

			// 以下对象都没有自身属性。
			const date = new Date();
			const object = {};
			const fakeDate = {};

			Object.setPrototypeOf(fakeDate, Date.prototype);

			assert.deepEqual(object, fakeDate);
			// 测试通过，不测试原型。
			assert.deepStrictEqual(object, fakeDate);
			// 抛出 AssertionError: {} deepStrictEqual Date {}
			// 因为原型不同。

			assert.deepEqual(date, fakeDate);
			// 测试通过，不测试类型标签。
			assert.deepStrictEqual(date, fakeDate);
			// 抛出 AssertionError: 2017-03-11T14:25:31.849Z deepStrictEqual Date {}
			// 因为类型标签不同。

			assert.deepStrictEqual(new Number(1), new Number(2));
			// 测试不通过，因为数值对象包装器里面的数值也会被比较。
			assert.deepStrictEqual(new String('foo'), Object('foo'));
			// 测试通过，因为这两个对象和里面的字符串都是相同的

			如果两个值不相等 则抛出一个带有message属性的AssertionError 其中message属性的值等于传入的
			message参数的值   如果message参数为undefined 则赋予默认的错误信息


	1-4	assert.doesNotThrow(block[,error][,message])
			断言block不会抛出错误
			当assert.doesNotThrow()被调用的时，他会立即调用block函数
			如果抛出错误并且错误类型与error参数指定的相同 则抛出AssertionError 如果错误类型不相同
			或者error参数为undefined 则抛出错误

			以下例子会抛出TypeError 因为在断言中没有匹配的错误类型
			1.SyntaxError（语法错误）
			2.ReferenceError（引用错误）
			3.RangeError（范围错误）
			4.TypeError（类型错误）
			5.URLError（URL错误）
			6.EvalError（eval错误）
			https://www.cnblogs.com/yanze/p/5997489.html

			assert.doesNotThrow(
			  () => {
			    throw new TypeError('错误信息');
			  },
			  SyntaxError
			);

			以下例子会派出一个带有 Got unwanted exception (TypeError)...信息的AssertionError
			assert.doesNotThrow(
			  () => {
			    throw new TypeError('错误信息');
			  },
			  TypeError
			);

			如果抛出了AssertionError且有给message参数传值，则message参数的值会被附加到AssertionError的信息中：
			assert.doesNotThrow(
				() => {
				  throw new TypeError('错误信息');
				},
				TypeError,
				'抛出错误'
			);
				// 抛出 AssertionError: Got unwanted exception (TypeError). 抛出错误

		1-5	assert.equal(actual, expected[, message])
				使用相等运算符 == 测试actual参数和expected参数是否相等

				const assert = require('assert');

				assert.equal(1, 1);
				// 测试通过，1 == 1。
				assert.equal(1, '1');
				// 测试通过，1 == '1'。

				assert.equal(1, 2);
				// 抛出 AssertionError: 1 == 2
				assert.equal({ a: { b: 1 } }, { a: { b: 1 } });
				// 抛出 AssertionError: { a: { b: 1 } } == { a: { b: 1 } }

				如果两个值不相等，则抛出一个带有 message 属性的 AssertionError，其中 message 属性的值
				等于传入的 message 参数的值。 如果 message 参数为 undefined，则赋予默认的错误信息。

		1-6 assert.fail(actual, expected[, message[, operator[, stackStartFunction]]])
				抛出AssertionError 如果message参数为空 则错误信息为actual参数 + operator参数 + expected参数。
				如果只提供了actual参数与expected参数，则operator参数默认为 "!=" 如果提供了message参数 则他会作为错误信息，
				其他参数会保存在错误对象的属性中。如果提供了stackStartFunction参数，则改函数上的栈帧都会从栈信息中移除】

				const assert = require('assert');

				assert.fail(1, 2, undefined, '>');
				// 抛出 AssertionError [ERR_ASSERTION]: 1 > 2

				assert.fail(1, 2, '错误信息');
				// 抛出 AssertionError [ERR_ASSERTION]: 错误信息

				assert.fail(1, 2, '错误信息', '>');
				// 抛出 AssertionError [ERR_ASSERTION]: 错误信息
				// 上面两个例子的 `actual` 参数、`expected` 参数与 `operator` 参数不影响错误消息。

				assert.fail();
				// 抛出 AssertionError [ERR_ASSERTION]: Failed

				assert.fail('错误信息');
				// 抛出 AssertionError [ERR_ASSERTION]: 错误信息

				assert.fail('a', 'b');
				// 抛出 AssertionError [ERR_ASSERTION]: 'a' != 'b'

				例子，使用 stackStartFunction 参数拦截异常的栈信息：
				function suppressFrame() {
					assert.fail('a', 'b', undefined, '!==', suppressFrame);
				}
				suppressFrame();
				// AssertionError [ERR_ASSERTION]: 'a' !== 'b'
				//     at repl:1:1
				//     at ContextifyScript.Script.runInThisContext (vm.js:44:33)
				//     ...

		1-7 assert.ifError(value)
				如果value 为真 则抛出value。可用于测试回调函数的error函数
				const assert = require('assert');

				assert.ifError(0);
				// 测试通过。
				assert.ifError(1);
				// 抛出 1。
				assert.ifError('error');
				// 抛出 'error'。
				assert.ifError(new Error());
				// 抛出 Error。

		1-8 assert.notDeepEqual(actual, expected[, message])
				测试actual参数和expected参数是否不深度相等   与assert.deepEqual()相反

				const assert = require('assert');

				const obj1 = {
				  a: {
				    b: 1
				  }
				};
				const obj2 = {
				  a: {
				    b: 2
				  }
				};
				const obj3 = {
				  a: {
				    b: 1
				  }
				};
				const obj4 = Object.create(obj1);

				assert.notDeepEqual(obj1, obj1);
				// 抛出 AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

				assert.notDeepEqual(obj1, obj2);
				// 测试通过，obj1 与 obj2 不深度相等。

				assert.notDeepEqual(obj1, obj3);
				// 抛出 AssertionError: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }

				assert.notDeepEqual(obj1, obj4);
				// 测试通过，obj1 与 obj4 不深度相等。

				如果两个值深度相等，则抛出一个带有 message 属性的 AssertionError，其中 message
				属性的值等于传入的 message 参数的值。 如果 message 参数为 undefined，则赋予默认的错误信息。


		1-9 assert.notDeepStrictEqual(actual, expected[,message])

		测试actual参数和expected参数是否不深度全等 与assert.deepStrictEqual()相反
		const assert = require('assert');

		assert.notDeepEqual({ a: 1 }, { a: '1' });
		// 抛出 AssertionError: { a: 1 } notDeepEqual { a: '1' }

		assert.notDeepStrictEqual({ a: 1 }, { a: '1' });
		// 测试通过。

		如果两个值深度全等，则抛出一个带有 message 属性的 AssertionError，其中 message 属性的值
		等于传入的 message 参数的值。 如果 message 参数为 undefined，则赋予默认的错误信息

		1-10 assert.ok(value[,message])

		测试value是否为真值。相当于assert.equal(!!value, true, message)

		如果value不为真值，则抛出一个带有message属性的AssertionError,其中message属性的值等于传入的
		值，如果message参数为undefined 则赋予默认的错误信息。

		const assert = require('assert');

		assert.ok(true);
		// 测试通过。
		assert.ok(1);
		// 测试通过。
		assert.ok(false);
		// 抛出 "AssertionError: false == true"
		assert.ok(0);
		// 抛出 "AssertionError: 0 == true"
		assert.ok(false, '不是真值');
		// 抛出 "AssertionError: 不是真值"


		1-11 assert.strictEqual(actual, expected[, message])
		使用全等运算符 === 测试actual参数和expected参数是否全等
		const assert = require('assert');

		assert.strictEqual(1, 2);
		// 抛出 AssertionError: 1 === 2

		assert.strictEqual(1, 1);
		// 测试通过。

		assert.strictEqual(1, '1');
		// 抛出 AssertionError: 1 === '1'
		如果两个值不全等，则抛出一个带有 message 属性的 AssertionError，其中 message 属性的值
		等于传入的 message 参数的值。 如果 message 参数为 undefined，则赋予默认的错误信息。

		1-12 assert.throws(block[, error][, message])
				断言block会抛出错误

				error参数可以是构造函数，正则表达式，或者自定义函数

				如果指定了message参数 则当block函数不抛出错误时，message参数会作为AssertionError的错误信息

				例子，error参数为构造函数
				assert.throws(
				  () => {
				    throw new Error('错误信息');
				  },
				  Error
				);

				例子，error 参数为正则表达式：

				assert.throws(
				  () => {
				    throw new Error('错误信息');
				  },
				  /错误/
				);

				例子，error 参数为自定义函数：

				assert.throws(
				  () => {
				    throw new Error('错误信息');
				  },
				  function(err) {
				    if ((err instanceof Error) && /错误/.test(err)) {
				      return true;
				    }
				  },
				  '不是期望的错误' 
				);

				error 参数不能是字符串。 如果第二个参数是字符串，则视为省略 error 参数，传入的字符串会被用于 message 参数。 例如：

				// 这是错误的！不要这么做！
				assert.throws(myFunction, '错误信息', '没有抛出期望的信息');

				// 应该这么做。
				assert.throws(myFunction, /错误信息/, '没有抛出期望的信息');


		注意事项：对于SameValueZero比较 建议使用ES2015的 Object.is()

		const a = 0;
		const b = -a;
		assert.notStrictEqual(a, b);
		// 抛出 AssertionError: 0 !== -0
		// 因为全等运算符不区分 -0 与 +0。
		assert(!Object.is(a, b));
		// 但 Object.is() 可以区分。

		const str1 = 'foo';
		const str2 = 'foo';
		assert.strictEqual(str1 / 1, str2 / 1);
		// 抛出 AssertionError: NaN === NaN
		// 因为全等运算符不能用于测试 NaN。
		assert(Object.is(str1 / 1, str2 / 1));
		// 但 Object.is() 可以测试。
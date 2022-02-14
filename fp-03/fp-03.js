/*
 * @Descripttion: Bug是不可能有的，这辈子都不可能有的🐶
 * @version: 
 * @Author: 陈夏雨
 * @Date: 2020-01-09 22:48:57
 * @LastEditors  : 陈夏雨
 * @LastEditTime : 2020-01-10 00:29:08
 */
console.log([1,2,3].map(item => item*2))
const log = function(a){
    console.log(`this.a=${this.a} - a=${a}`)
}
log.bind({a:1},2)()
class Person {
    constructor(name){
        this._name = name
    }
    get name(){
        return this._name
    }
    set name(name){
        this._name = name
    }
    get address(){
        return this._address
    }
    set address(address){
        this._address = address
    }
    toString(){
        return `I am ${this._name}, from ${this._address}`
    }
}

class Student extends Person{
    constructor(name, school){
        super(name)
        this.school = school
    }
}

const xiaYu = new Student('xiaYu', 'A')
const deYuan = new Student('deYuan', 'B')
const daQing = new Student('daQing', 'A')
const meiMei = new Student('meiMei', 'B')
const daSheng = new Student('daSheng', 'F')
xiaYu.address = 'D'
deYuan.address = 'C'
daQing.address = 'D'
meiMei.address = 'C'
daSheng.address = 'C'
var array = [xiaYu, deYuan, daQing, meiMei, daSheng]
// 找出所有地址为C且学校为B的小伙子
// 命令式的写法
const getListByAddressAndSchool = (address, school, people) => {
    // var result = []
    for (let index = 0; index < people.length; index++) {
        const student = people[index];
        if(student.address == address && student.school == school){
            // result.push(student)
            console.log(student)
        }
    }
    // return result
}
console.time('1')
console.log(getListByAddressAndSchool('C','B', array))
console.timeEnd('1')

// 函数式的写法
const isC = student => student.address == 'C'
const isB = student => student.school == 'B'
console.time('2')
console.log(array.filter(isC).filter(isB).forEach(console.log))
console.timeEnd('2')

// 闭包
const addCount = (count) => (i) => {
    count = i + count
    return count
}
const addOne = addCount(1) // 传入 count
console.log(addOne(2)) // count+i 虽然addCount这个方法已经执行，但后续仍然能访问到变量count
console.log(addOne(4)) // 7
const outParams = 'outParams'
const logParams = (params) => (nowParams) => console.log(`${outParams}-${params}-${nowParams}`)
logParams('params')('nowParams')

// 作用域链
var globalVal = 'global'
function getGlobalVal(){
    console.log(globalVal)
}
getGlobalVal()

function getVal(){
    var localVal = 'local'
    !(function(){
        var innerVal = 'inner'
        console.log(`${globalVal}-${localVal}-${innerVal}`)
    }())
}
getVal();

(() => {
	if(true){
			var a = 1
			let b = 1
			const c = 1
	}
	console.log(a) //1
	// console.log(b) // 报错
	// console.log(c) // 报错
})();


(() => {
	const p = {name: 'curry'}
	const name = p => p.name
	console.log(name(p)) // curry
	/*
		var lambda = (param1,...) => expression
		var lambda = (param1,...) => {
			statement1,
			statement2,
			return result
		}
	*/
})();


(() => {
	// map: 将一个迭代函数有序的应用于数组的每个元素，并返回长度相等的新数组
	// map([e0, e1, e2, e3, e4], fn) => [fn(e0), fn(e1), fn(e2), fn(e3), fn(e4)]
	function map(list, fn){
		var idx = 0
		var len = list.length
		var res = new Array(len)
		while (idx < len){
				res[idx] = fn(list[idx], idx, list)
				idx += 1
		}
		return res
	}
	console.log(map([1,2,3,4], (item, index, list) => {
		console.log(item, index, list)
		return item * 2
	})) // [2, 4, 6, 8]
})();


(() => {
	// reduce: 将一个数组的元素精简为单一值，该值由每个元素与一个积累值通过一个函数计算得出
	// reduce([e0, e1, e2, e3, e4], fn, acc) => fn(fn(fn(fn(fn(acc ,e0), e1), e2), e3), e4) = R
	function reduce(list, fn, acc){
		var idx = 0
		var len = list.length
		var res = 0
		if(!acc && len > 0){
			acc = list[idx]
			idx += 1
		}
		while (idx < len){
			acc = fn(acc, list[idx], idx, list)
			idx += 1
		}
		return acc
	}
	console.log(reduce([1,2,3,4], (prev, item, index, list) => {
		console.log(prev, item, index, list)
		return prev + item
	}, 1)) // 11
})();

(() => {
	// filter: 能够遍历出数组中元素并返回一个新子集数组的高阶函数
	// filter([e0, e1, e2, e3, e4], fn) => [e1, e2]
	function filter(list, fn){
		var idx = 0
		var len = list.length
		var res = new Array()
		while (idx < len){
			if(fn(list[idx], idx, list)){
				res.push(list[idx])
			}
			idx += 1
		}
		return res
	}
	console.log(filter([1,2,3,4], (item, index, list) => {
		console.log(item, index, list)
		return item & 1
	})) // [1, 3]
})();

(() => {
	// every: 使用传入函数检查数组每项是否为true
	// every([e0, e1, e2, e3, e4], fn) => fn(e0) && fn(e1) && fn(e2) && fn(e3) && fn(e4)
	function every(list, fn){
		var idx = 0
		var len = list.length
		var res = true
		while (idx < len && res){
			res = res && fn(list[idx], idx, list)
			idx += 1
		}
		return !!res
	}
	console.log(every([1,2,3,4], (item, index, list) => {
		console.log(item, index, list)
		return item > 0
	})) // false
})();

(() => {
	// some: 使用传入函数检查数组中任意一项是否为true
	// some([e0, e1, e2, e3, e4], fn) => fn(e0) || fn(e1) || fn(e2) || fn(e3) || fn(e4)
	function some(list, fn){
		var idx = 0
		var len = list.length
		var res = false
		while (idx < len && !res){
			res = res || fn(list[idx], idx, list)
			idx += 1
		}
		return !!res
	}
	console.log(some([1,2,3,4], (item, index, list) => {
		console.log(item, index, list)
		return item > 2
	})) // true
})();

(() => {
	// sortBy: 接受一个参数并返回一个比较函数
	function sortBy(property){
		return (a, b) => a[property] < b[property] ? -1 : (a[property] > b[property]) ? 1 : 0
	}
	var people = [
		{
			name: 'aa',
			age: 10
		}, 
		{
			name: 'bb',
			age: 9
		},
		{
			name: 'cc',
			age: 3
		},
		{
			name: 'dd',
			age: 15
		}
	]
	console.log(people.sort(sortBy('name')))
	/*
		[
			{ name: 'aa', age: 10 },
			{ name: 'bb', age: 9 },
			{ name: 'cc', age: 3 },
			{ name: 'dd', age: 15 }
		]
	*/
});

(() => {
	// tap: 接受一个value并返回一个包含value的闭包函数
	function tap(value) {
		return fn => fn(value);
	}
	[1,2,3].forEach(item => {
		tap(item)((val) => {
			console.log(val)
		})
	})
});

(() => {
	// unary: 将多参数的函数转换成只接受一个参数的函数
	function unary(fn){
		return fn.length === 1 ? fn : arg => fn(arg);
	}
	console.log([1,2,3].map(parseInt)) // [ 1, NaN, NaN ]
	console.log([1,2,3].map(unary(parseInt))) // [ 1, 2, 3 ]
});


(() => {
	// once: 将函数转换成只允许运行一次的函数
	function once(fn){
		var done = false;
		return function(){
			if(done) throw new Error('只允许运行一次')
			done = true;
			return fn.apply(this, arguments);
		}
	}
	const doSomething = once(function(){
		console.log('do something')
	});
	doSomething() // do something
	doSomething() // error
});

(() => {
	// memoized: 使函数记住计算结果
	function memoized(fn){
		var _data = {}
		return function(){
			var key = Array.prototype.slice.call(arguments).toString()
			if(typeof _data[key] === 'undefined'){
				_data[key] = fn.apply(this, arguments);
		}
			return _data[key]
		}
	}
	const add = memoized((a, b) => a + b)
	console.log(add(1, 2)) // 3
	console.log(add(1, 2)) // 3
})();

(() => {
	function curry(fn){
		return function curried(){
			var args = Array.prototype.slice.call(arguments)
			if(args.length < fn.length){
				return function(){
					return curried.apply(null, args.concat( [].slice.call(arguments) ))
				};
			}
			return fn.apply(null, args)
		}
	}
	let add = curry((a, b, c) => a + b + c)
	console.log(add(1)(1)(1))

	var _ = {}
	function partial(){
		var fn = arguments[0]
		var args = Array.prototype.slice.call(arguments, 1)
		function bind(){
			var pos = 0
			_args = args.slice()
			var len = _args.length
			for(var i = 0; i < len; i++){
				_args[i] = _args[i] === _ ? arguments[pos++] : _args[i]
			}
			while(pos < arguments.length) _args.push(arguments[pos++])
			return fn.apply(this, _args)
		}
		var F = function(){}
		F.prototype = fn.property
		bind.prototype = new F()
		return bind
	}
	const a = partial((a,b,c,d) => [a, b, c,d], 1, _, 3, _)
	console.log(a(2, 4)) // [1,2,3,4]

	function compose(){
		var funcs = Array.prototype.slice.call(arguments)
		var start = funcs.length - 1
		return function(){
			var result = funcs[start].apply(this, arguments)
			while (start--) result = funcs[start].call(this, result)
			return result
		}
	}
	function compose(...fns){
		return value => fns.reduceRight((prev, fn) => fn(prev), value)
	}
	function pipe(){
		var funcs = Array.prototype.slice.call(arguments)
		var start = 0
		return function(){
			var result = funcs[start++].apply(this, arguments)
			while (start < funcs.length) result = funcs[start++].call(this, result)
			return result
		}
	}
	function pipe(...fns){
		return value => fns.reduce((prev, fn) => fn(prev), value)
	}
	var number = compose(Math.round, parseFloat, console.log)
	number('3.5333')


// 配合偏函数使用
	var filter = (f, ary) => {
		return ary.filter(f)
	}
	var map = (f, ary) => {
		return ary.map(f)
	}
	var nameNoEmpty = partial(filter, item => item.name !== '', _)
	var addOne = partial(map, item => {
		const target = { ...item }
		target.age += 1
		return target
	}, _)
	var log = val => {
		console.log(val)
		return val
	}
	var people = [
		{ name: 'J', age: 18},
		{ name: 'K', age: 10},
		{ name: '', age: 12},
		{ name: 'E', age: 13},
	]
	var c = compose(log, addOne, nameNoEmpty)
	// c(people)

	function tap(fn, val){
		fn(val)
		return val
	}
	const debug = partial(tap, (val) => {
		console.log('-- debug --')
		console.log(val)
		console.log('-- debug end --')
	})
	
	var c = pipe(nameNoEmpty, debug, addOne, log)
	// c(people)

	function alt (fn1, fn2){
		return val => fn1(val) || fn2(val)
	}
	var find = (val) => {
		return people.find(item => item.name === val)
	}
	var create = (val) => {
		return {
			name: val,
			age: 11
		}
	}
	var getPerson = alt(find, create)
	var show = pipe(getPerson, log)
	show('M') // { name: 'M', age: 11 }

	function seq(...fns){
		return val => {
			fns.forEach(fn => {
				fn(val)
			})
		}
	}
	var c = pipe(partial(tap, seq(debug, debug)), addOne, log)
	c(people)

	function fork(join, fork1, fork2){
		return val => join(fork1(val), fork2(val))
	}

	var sum = val => val.reduce((sum, val) => sum + val, 0)
	var len = val => val.length
	var divide = (sum, len) => sum / len
	var d = pipe(fork(divide, sum, len), log)
	d([10,20,30,40]) // 25

})();
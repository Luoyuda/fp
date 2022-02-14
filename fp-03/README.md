## JavaScript 的函数
函数是函数式编程中的工作单元和中心。函数是任何可调用 `()` 操作求值的表达式。
在 `JavaScript` 的世界中，函数的两个重要特性：一等的和高阶的。
### 一等函数
一等的指的是语言层面上将函数视为真是的对象。
1. 作为匿名函数或 `lambda` 表达式给变量赋值
    ```javascript
    let func1 = function(e){}
    let func2 = e => e
    ```
2. 作为成员方法给对象属性赋值
    ```javascript
    const obj = {
        func: e => e
    }
    ```
3. 可以作为构造函数进行实例化
   ```javascript
   const a = new func1()
   ```
### 高阶函数
函数还可以将其他函数作为参数进行传递，或是有其他函数进行返回，这就是高阶函数。比如数组原型方法上的 `map` 方法接收一个函数作为参数，`bind` 方法可以返回一个函数
```javascript
console.log([1,2,3].map(item => item*2))
const log = function(a){
    console.log(`this.a=${this.a} - a=${a}`)
}
log.bind({a:1},2)()
var array = [xiaYu, deYuan, daQing, meiMei, daSheng]
// 找出所有地址为C且学校为B的小伙子
// 命令式的写法
const getListByAddressAndSchool = (address, school, people) => {
    var result = []
    for (let index = 0; index < people.length; index++) {
        const student = people[index];
        if(student.address == address && student.school == school){
            result.push(student)
            // console.log(student)
        }
    }
    return result
}
console.log(getListByAddressAndSchool('C','B', array))

// 函数式的写法
const isC = student => student.address == 'C'
const isB = student => student.school == 'B'
console.log(array.filter(isC).filter(isB))
```
### 函数调用类型
1. 作为全局函数调用
2. 作为方法调用
3. 作为构造函数跟 `new` 一起使用，返回一个新创建的对象引用

### 闭包
闭包：可以能够在函数声明过程中将环境信息与所属函数绑定在一起的数据结构。简单点来说，就是可以访问到自由变量的函数就叫闭包。
```javascript
// 闭包
const addCount = (count) => (i) => {
    count = i + count
    return count
}
// 传入 count
const addOne = addCount(1) // count = 1
// count+i 虽然addCount这个方法已经执行，但后续仍然能访问到变量count
console.log(addOne(2)) // count = 3
console.log(addOne(4)) // count = 7
// 闭包可以访问到整个作用域链上的所有变量
const outParams = 'outParams'
const logParams = (params) => (nowParams) => console.log(`${outParams}-${params}-${nowParams}`)
logParams('params')('nowParams') // outParams-params-nowParams
```
### 作用域
1. 全局作用域：任何对象和变量在脚本最外层声明都会成为全局作用域的一部分。
    ```javascript
    var globalVal = 'global'
    function getGlobalVal(){
        console.log(globalVal)
    }
    getGlobalVal()
    ```
2. 函数作用域：目前适用的作用域机制，在函数声明时，任何变量都是局部且外部不可见的，且函数返回后声明的局部变量会被删除
   1. 访问变量时，作用域链的机制
      1. 先检查当前作用域是否存在此变量
      2. 检查父作用域是否存在此变量
      3. 直到最外层作用域，如果没有，返回undefined
    ```javascript
    function getVal(){
        var localVal = 'local'
        !(function(){
            var innerVal = 'inner'
            console.log(`${globalVal}-${localVal}-${innerVal}`)
        }())
    }
    getVal()
    ```
3. 块级作用域（ES6），在代码块中声明的变量，离开代码块后会被回收
    ```javascript
    if(true){
        var a = 1
        let b = 1
        const c = 1
    }
    console.log(a) //1
    console.log(b) // 报错
    console.log(c) // 报错
    ```

### lambda表达式

lambda表达式再JavaScript中也称箭头函数

```JS
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
```

### map、reduce、filter、every、some、sortBy、tap、unary、once、memoized的实现

1. map: 将一个迭代函数有序的应用于数组的每个元素，并返回长度相等的新数组
 * map([e0, e1, e2, e3, e4], fn) => [fn(e0), fn(e1), fn(e2), fn(e3), fn(e4)]

```js
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
```

2. reduce: 将一个数组的元素精简为单一值，该值由每个元素与一个积累值通过一个函数计算得出
 * reduce([e0, e1, e2, e3, e4], fn, default) => fn(fn(fn(fn(fn(default ,e0), e1), e2), e3), e4) = R

```js
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
```

3. filter: 能够遍历出数组中元素并返回一个新子集数组的高阶函数
 * filter([e0, e1, e2, e3, e4], fn) => [e1, e2]

```js
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
```

4. every: 使用传入函数检查数组每项是否为true
 * every([e0, e1, e2, e3, e4], fn) => fn(e0) && fn(e1) && fn(e2) && fn(e3) && fn(e4)

```js
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
})) // true
```

5. some: 使用传入函数检查数组中任意一项是否为true
 * some([e0, e1, e2, e3, e4], fn) => fn(e0) || fn(e1) || fn(e2) || fn(e3) || fn(e4)

```js
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
```

6. sortBy: 接受一个参数并返回一个比较函数
```js
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
```

7. tap: 接受一个value并返回一个包含value的闭包函数
```js
function tap(value) {
	return fn => fn(value);
}
[1,2,3].forEach(item => {
	tap(item)((val) => {
		console.log(val)
	})
})
```
8. unary: 将多参数的函数转换成只接受一个参数的函数
```js
function unary(fn){
	return fn.length === 1 ? fn : arg => fn(arg);
}
console.log([1,2,3].map(parseInt)) // [ 1, NaN, NaN ]
console.log([1,2,3].map(unary(parseInt))) // [ 1, 2, 3 ]
```

9. once: 将函数转换成只允许运行一次的函数
```js
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
```
10. memoized: 使函数记住计算结果
```js
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
```

### 柯里化

柯里化是指将一个多参数的函数转换成为一个嵌套的一元函数
* fn(a, b, c) => fn(a)(b)(c) / fn(a, b)(c) ...

```js
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
var filter = curry((f, ary) => {
	return ary.filter(f)
})
var nameNoEmpty = filter(item => item.name !== '')
var filter12 = filter(item => item.age > 12)
var people = [
	{ name: 'J', age: 18},
	{ name: 'K', age: 10},
	{ name: '', age: 12},
	{ name: 'E', age: 13},
]
console.log(nameNoEmpty(people))
console.log(filter12(people))
```

### 偏函数

就是把一个函数的某些参数先固化，也就是设置默认值，返回一个新的函数，在新函数中继续接收剩余参数

```js
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
```

### 组合

接受一个函数的输出并将其结果传递给下一个函数，👈右往左

```js
function compose(){
	var funcs = Array.prototype.slice.call(arguments)
	var start = funcs.length - 1
	return function(){
		var result = funcs[start].apply(this, arguments)
		while (start--) result = funcs[start].call(this, result)
		return result
	}
}
// es6
function compose(...fns){
	return value => fns.reduceRight((prev, fn) => fn(prev), value)
}
var number = compose(Math.round, parseFloat)
console.log(number('3.5333')) // 4

// 配合偏函数使用
var filter = (f, ary) => {
	return ary.filter(f)
}
var map = (f, ary) => {
	return ary.map(f)
}
var nameNoEmpty = partial(filter, item => item.name !== '', _)
var addOne = partial(map, item => (item.age += 1) && item, _)
var people = [
	{ name: 'J', age: 18},
	{ name: 'K', age: 10},
	{ name: '', age: 12},
	{ name: 'E', age: 13},
]
var c = compose(console.log, addOne, nameNoEmpty)
c(people)
```

### 管道

接受一个函数的输出并将其结果传递给下一个函数，左往右👉
```js
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
```

### 常用的组合子

1. identity: 返回与参数同值的函数 `a => a`
2. tap: 接受一个输入对象和函数，以输入对象作为参数执行，并将输入对象返回 `(fn, a) => fn(a) && a`
```js
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
c(people)
```
3. alt: 接受两个函数，执行简单的条件逻辑 `(fn1, fn2) => val => fn1(val) || fn2(val)`
```js
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
```
4. seq: 用于遍历函数序列，接受N个函数，会用相同的顺序调用函数，该函数不会有返回值 `(...args) => val => args.forEach(fn => fn(val))`
```js
	function seq(...fns){
		return val => {
			fns.forEach(fn => {
				fn(val)
			})
		}
	}
	var c = pipe(partial(tap, seq(debug, debug)), addOne, log)
	c(people)
```
5. fork: 用于需要以两种不同方式处理单个资源的情况，接受3个函数，1个join和2个fork函数处理输入 `(join, fork1, fork2) => val => join(fork1(val), fork2(val))`

```js
function fork(join, fork1, fork2){
	return val => join(fork1(val), fork2(val))
}

var sum = val => val.reduce((sum, val) => sum + val, 0)
var len = val => val.length
var divide = (sum, len) => sum / len
var d = pipe(fork(divide, sum, len), log)
d([10,20,30,40]) // 25
```

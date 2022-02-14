# 异常处理

* 命令式
  * 使用try-catch包裹不安全的代码
  * 缺陷
    * 难以与其他函数组合或链接
    * 违反引用透明性，不能确保单一的可预测的返回值
    * 引起副作用
    * 违反非局域性的原则
    * 不能只关注函数返回值，需关注和管理异常
    * 多个异常时会发生嵌套的异常处理块

```js
try{
  try{

  }catch(error){
    try{

    }catch(error){
      
    }
  }
}catch(error){

}
```

* 函数式
  * 使用Functor来处理异常

## Functor(函子)

> 函子是一个普通对象，它实现了map函数，在遍历每个对象值时生成一个新的对象

### 函子是容器

函子是一个持有值的容器，能持有任何传给它的值，称为Container

```js
const Container = function(val){
  this.value = val
}
// of 静态方法
Container.of = function(val){
  return new Container(val)
}
```
### 实现map方法

map 函数从 Container 中取出值后将传入的函数应用于其上，并将结果放回Container

```js

Container.prototype.map = function(fn){
  return Container.of(fn(this.value))
}
console.log(Container.of(3).map(val => val * 2)) // { value : 6 }
```

### MayBe 函子

在应用函数之前会检查null和undefined值，不需要抛出错误也可以往下执行

```js
const MayBe = function(val){
  this.value = val
}

MayBe.of = function(val){
  return new MayBe(val)
}

MayBe.prototype.isNothing = function(){
  return this.value === null || this.value === undefined
}

MayBe.prototype.map = function(fn){
  return this.isNothing() ? MayBe.of(null) : MayBe.of(fn(this.value))
}

MayBe.of('string').map(val => val.toUpperCase()).map(val => val + ': 123') // { value: "STRING: 123" }
MayBe.of(null).map(val => val.toUpperCase()).map(val => val + ': 123') // { value: null }
```

### Either 函子

either函子为了解决分支拓展问题，为失败结果提供更多信息

```js
const Nothing = function(val){
  this.value = val
}

Nothing.of = function(val){
  return new Nothing(val)
}

Nothing.prototype.map = function(){
  return this
}

const Some = function(val){
  this.value = val
}

Some.of = function(val){
  return new Some(val)
}

Some.prototype.map = function(fn){
  return Some.of(fn(this.value))
}

const Either = {
  Some: Some,
  Nothing: Nothing
}

function getData(){
  return Math.random() > .1 ? Either.Some.of({ data: [1, 2, 3] })
  : Either.Nothing.of('Error: none')
}

var data = getData()
console.log(data.map(val => val)) // Some { value: { data: [ 1, 2, 3 ] } } || Nothing { value: 'Error: none' }
```

### Monad 

Monad 用于创建一个带有一定规则的容器
* 接口定义规范
  * 类型构造函数：创建Monadic类型（类似于Wrapper的构造函数）
  * unit函数：可将特定类型的值放入Monadic结构中（of函数）
  * bind函数：可以链式操作（map函数）
  * join函数：可以将两层的Monadic接口合并为一层

```js
class Wrapper{
  constructor(value){
    this._value = value
  }
  // unit函数
  static of(value){
    return new Wrapper(value)
  }
  // bind 函数
  map(f){
    return Wrapper.of(f(this._value))
  }
  // join 函数
  join(){
    if(!(this._value instanceof Wrapper)){
      return this
    }
    return this._value.join()
  }
  toString(){
    return `wrapper (${this._value})`
  }
}
console.log(Wrapper.of('Hello Monad!').map(val => val.toUpperCase()).toString()) // wrapper (HELLO MONAD!)
console.log(Wrapper.of(Wrapper.of(Wrapper.of('Hello Monad!'))).join()) // Wrapper { _value: 'Hello Monad!' }
```

#### MayBe Monad

侧重于整合判空逻辑
* just(value): 表示值的容器
* Nothing(): 表示要么没有值、失败信息

```js
class MayBe {
  static just(val) {
    return new Just(val)
  }
  static nothing(val) {
    return new Nothing(val)
  }
  static fromNullable(val){
    return val !== null ? this.just(val) : this.nothing()
  }
  static of(val) {
    return this.just(val)
  }
  get isNothing (){
    return false
  }
  get isJust (){
    return false
  }
}
class Just extends MayBe {
  constructor(val) {
    super()
    this._value = val
  }
  get value () {
    return this._value
  }
  map(f){
    return MayBe.of(f(this.value))
  }
  getOrElse(){
    return this.value
  }
  filter(f){
    return MayBe.fromNullable(f(this.value) ? this.value : null)
  }
  get isJust(){
    return true
  }
  get toString(){
    return `MayBe.Just(${this.value})`
  }
}

class Nothing extends MayBe{
  map(){
    return this
  }
  get value(){
    throw new TypeError('Nothing')
  }
  getOrElse(other){
    return other
  }
  filter(){
    return this.value
  }
  get isNothing (){
    return true
  }
  toString(){
    return `MayBe.Nothing`
  }
}


function getData(){
  return MayBe.fromNullable(Math.random() > .1 ? [1,2,3]: null)
}

var data = getData()
console.log(data.map(val => val)) //Just { _value: [ 1, 2, 3 ] } || Nothing {}
```

#### Either Monad

Either 代表两个逻辑分离的值 a 和 b，永远不会同时出现
* left(a) 包含一个可能的错误信息或抛出的异常对象
* right(a) 包含一个成功的值

```js
class Either {
  constructor(value){
    this._value = value
  }
  get value(){
    return this._value
  }
  static left(val){
    return new Left(val)
  }
  static right(val){
    return new Right(val)
  }
  static fromNullable(val){
    return val !== null ? Either.right(val) : Either.left(val)
  }
  static of(val){
    return new Right(val)
  }
}
class Left extends Either{
  map(){
    return this
  }
  get value(){
    throw new TypeError('Nothing')
  }
  getOrElse(other){
    return other
  }
  orElse(f){
    return f(this.value)
  }
  chain(){
    return this
  }
  getOrElseThrow(val){
    throw new Error(val)
  }
  filter(){
    return this
  }
  toString(){
    return `Either.Left(${this.value})`
  }
}

class Right extends Either{
  map(f){
    return Either.of(f(this.value))
  }
  getOrElse(){
    return this.value
  }
  orElse(val){
    return this
  }
  chain(f){
    return f(this.value)
  }
  getOrElseThrow(){
    return this.value
  }
  filter(f){
    return Either.fromNullable(f(this.value) ? this.value : null)
  }
  toString(){
    return `Either.Right(${this.value})`
  }
}


function getData(){
  return Either.fromNullable(Math.random() > .1 ? [1,2,3]: null)
}

var data = getData()
console.log(data.map(val => val)) //Right { _value: [ 1, 2, 3 ] } || Left { _value: null }
```
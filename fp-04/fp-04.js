(() => {
  const Container = function(val){
    this.value = val
  }
  // of 静态方法
  Container.of = function(val){
    return new Container(val)
  }
  Container.prototype.map = function(fn){
    return Container.of(fn(this.value))
  }
  
  console.log(Container.of(Container.of(3)))
  console.log(Container.of(3).map(val => val * 2)) // { value : 6 }
  
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
  
  console.log(MayBe.of('string').map(val => val.toUpperCase()).map(val => val + ': 123')) // { value: "STRING: 123" }
  console.log(MayBe.of(null).map(val => val.toUpperCase()).map(val => val + ': 123')) // { value: null }
  
  
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
  
});

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


// function getData(){
//   return MayBe.fromNullable(Math.random() > .1 ? [1,2,3]: null)
// }

// var data = getData()
// console.log(data.map(val => val)) //Just { _value: [ 1, 2, 3 ] } || Nothing {}


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
  return Math.random() > 1 ? Either.right([1,2,3,4,5]) : Either.left('error')
}

var data = getData()
console.log(data.map(val => val)) //Right { _value: [ 1, 2, 3 ] } || Left { _value: null  }

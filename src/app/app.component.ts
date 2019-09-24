import { Component } from '@angular/core';
import { Type, Transform, classToPlain, plainToClass } from 'class-transformer';

export function TestDecorator(config) {
  return function(target){
    Object.defineProperty(target.prototype, 'find', {
        value:  function () {
          return {data: config.baseUrl}
        }
    });
    Object.defineProperty(target.prototype, 'save', {
        value:  function () {
          return {data: this.name}
        }
    });  

  }
}

interface MyInterface {
  id: string;
  name: string;
  age: number;
  date: Date;
}

class MyClass {
  id: string;
  name: string;
  age: number;
  @Type(() => Date)
  @Transform(value => value.toLocaleDateString(), { toPlainOnly: true })
  date: Date;

  constructor(param: MyInterface) {
    this.id = param.id;
    this.name = param.name;
    this.age = param.age;
    this.date = param.date;
  }
}

class Activity{
  name: string;
  getName(){
    return this.name
  }
}

@TestDecorator({
  baseUrl: 'gem_users/api/workflows'
})
export class Workflow{
  name: string;

  getName(){
    return this.name
  }

  @Type(() => Activity)
  activity: Activity

}


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Angular';

  constructor() {

    let data = {
      id: '123',
      name: 'bob',
      age: 10,
      date: new Date('2019/12/15')
    }
    console.log(data);

    const data2: MyInterface = data;
    console.log(data2);

    this.myfunc(data2);

    let workflow = {name: 'workflow', activity: {name: 'activity'}}
    let c = plainToClass(Workflow, workflow);
    console.log("converted", c)

  }

  myfunc(param: MyInterface) {
    const c = new MyClass(param);
    console.log(c);

    console.log(classToPlain(c));
  }
}

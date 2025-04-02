import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../model/employee';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  apiUrl = 'http://localhost:3000/employees';

  employees$ = this.employeesSubject.asObservable();
  constructor(private http:HttpClient) { }

  getAllEmployee(): Observable<Employee[]>{
    return this.http.get<Employee[]>(this.apiUrl)
  }

  refreshEmployeeList():void{
    this.getAllEmployee().subscribe((date)=>{
      this.employeesSubject.next(date)
    })
  }

  getEmployeeById(id:number){
    return this.http.get<Employee>(`${this.apiUrl}/${id}`)
  }

  addEmployee(data:Employee){
  return this.http.post(`${this.apiUrl}`,data)
  }

  updateEmployee(data:Employee){
  return this.http.put(`${this.apiUrl}/${data.id}`,data)
  }

  deleteEmployee(empId:Employee){
  return this.http.delete(`${this.apiUrl}/${empId}`)
  }
}

import { Component, EventEmitter, Inject, Output, output } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { EmailValidator, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import {CommonModule } from '@angular/common';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../service/employee.service';


@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [MatButtonModule,
            MatCardModule,
            MatFormFieldModule,
            MatInputModule,
            MatSelectModule,
            MatDatepickerModule,
            ReactiveFormsModule,
            MatNativeDateModule,
            CommonModule
          ],
  providers: [
    {provide: DateAdapter, useClass: NativeDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS}
          ],
  templateUrl: './add-employee-dialog.component.html',
  styleUrl: './add-employee-dialog.component.scss'
})
export class AddEmployeeComponent {

  constructor(private dialog:MatDialog,private service:EmployeeService, private ref: MatDialogRef<AddEmployeeComponent>,
  @Inject(MAT_DIALOG_DATA) public data:{title:string,gridData:any}
  ) {
    this.title = data.title;
    if (data.gridData) {
      this.empForm.patchValue(data.gridData)
    }
    }

  @Output() employeeAdded= new EventEmitter<void>();
  title: any

  empForm = new FormGroup({
    id:new FormControl('',[Validators.required,]),
    name:new FormControl('',Validators.required),
    salary:new FormControl('',Validators.required),
    joining_date:new FormControl('',Validators.required),
    email:new FormControl('',Validators.required),
    address:new FormControl('',Validators.required)
  });

  saveEmployee() {

    if (this.empForm.valid) {
      let _data:Employee = {
        id:this.data?.gridData?.id ?? this.empForm.value.id as unknown as number,
        name: this.data?.gridData?.name ?? this.empForm.value.name as string,
        email: this.data?.gridData?.email ?? this.empForm.value.email as string,
        joining_date: new Date(this.data?.gridData?.joining_date ?? this.empForm.value.joining_date as unknown as Date),
        salary: this.data?.gridData?.salary ?? this.empForm.value.salary as string,
        address: this.data?.gridData?.address ?? this.empForm.value.address as unknown as string
      }
      if(_data.id){
        this.service.updateEmployee(_data).subscribe((res)=>{
          alert('update success');
          this.closeDialog();
        },(error)=>{
          console.log(error,'error');
          alert('error')
        })
      }else{
        this.service.addEmployee(_data).subscribe((res) => {
          alert('success');
          this.employeeAdded.emit();
          console.log(this.employeeAdded,'employee added');
          this.closeDialog();
        })
      }
    }
  }

  closeDialog() {
    this.empForm.reset();
    this.ref.close();
  }
}

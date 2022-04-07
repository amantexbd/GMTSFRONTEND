import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/shared/auth.service';
import { ConfirmedValidator } from 'src/app/shared/components/confirmedvalidator';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {
  userForm!:FormGroup;
  actionBtn: string="Save"
  hide = true;
  hide2 = true;
  addpass = true;

  constructor(private formBuilder:FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public editData:any,
    private dialogRef:MatDialogRef<UserDialogComponent>,
    private service:AuthService,) { }

  ngOnInit(): void {
    this.resetForm();
  }

  resetForm(){

    this.userForm=this.formBuilder.group({
      userId:[''],
      username:['',Validators.required],
      userFullName:['',Validators.required],
      email:['',Validators.required],
      password:['',Validators.required],
      password2:['',Validators.required],
      phoneNumber:['',Validators.required],
      officeBranch:[''],
      address:[''],
      isActive:false
    }, { 

      validator: ConfirmedValidator('password', 'password2')

    })

    if(this.editData){
      this.actionBtn="Update";
      this.addpass=false;
      this.userForm.controls['userId'].setValue(this.editData.userId);
      this.userForm.controls['username'].setValue(this.editData.username);
      this.userForm.controls['userFullName'].setValue(this.editData.userFullName);
      this.userForm.controls['email'].setValue(this.editData.email);
      this.userForm.controls['password'].setValue(this.editData.password);
      this.userForm.controls['password2'].setValue(this.editData.password2);
      this.userForm.controls['phoneNumber'].setValue(this.editData.phoneNumber);
      this.userForm.controls['officeBranch'].setValue(this.editData.officeBranch);
      this.userForm.controls['address'].setValue(this.editData.address);
      this.userForm.controls['isActive'].setValue(this.editData.isActive);

    }

  }
  addUser(){
    if(!this.editData){
      if(this.userForm.valid){
        console.log(this.userForm.value);
        this.service.addUser(this.userForm.value)
        .subscribe({
          next:(res)=>{
            this._snackBar.open("User Save Successfully", "Success", {
              duration: 1000
            });
            this.userForm.reset();
            this.dialogRef.close('save');
          },
          error:()=>{
            this._snackBar.open("Save Failed", "Failed");
          }
        })
      }
    }
    else{
      this.updateUser()
    }
   }
   updateUser(){
    this.service.updateUser(this.userForm.value)
    .subscribe({
      next:(res)=>{
        this._snackBar.open("User Update Successfully", "Update", {
          duration: 1000
        });
        this.userForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        this._snackBar.open("Update Failed", "Failed");
      }
    })
  }
  onFileChanged() {
    
  }
}

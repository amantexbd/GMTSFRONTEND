import { ApiServiceService } from './../../../api-service.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-companydialog',
  templateUrl: './companydialog.component.html',
  styleUrls: ['./companydialog.component.css']
})
export class CompanydialogComponent implements OnInit {
  companyForm!:FormGroup;
  actionBtn: string="Save"

  constructor(private formBuilder:FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public editData:any,
    private dialogRef:MatDialogRef<CompanydialogComponent>,
    private service:ApiServiceService,) { }

  ngOnInit(): void {
    this.resetForm();  
  }
  
  resetForm(){
    this.companyForm=this.formBuilder.group({
      id:[0],
      companyName:['',Validators.required],
      shortcutName:['',Validators.required],
      addressLine1:['',Validators.required],
      addressLine2:[''],
      websiteUrl:[''],
      isActive:false,
      // LogoUrl:File
    })

    if(this.editData){
      this.actionBtn="Update";
      this.companyForm.controls['id'].setValue(this.editData.id);
      this.companyForm.controls['companyName'].setValue(this.editData.companyName);
      this.companyForm.controls['shortcutName'].setValue(this.editData.shortcutName);
      this.companyForm.controls['addressLine1'].setValue(this.editData.addressLine1);
      this.companyForm.controls['addressLine2'].setValue(this.editData.addressLine2);
      this.companyForm.controls['websiteUrl'].setValue(this.editData.websiteUrl);
      this.companyForm.controls['isActive'].setValue(this.editData.isActive);
      

    }
   }
  addCompany(){
    if(!this.editData){
      if(this.companyForm.valid){
        console.log(this.companyForm.value);
        this.service.addCompany(this.companyForm.value)
        .subscribe({
          next:(res)=>{
            this._snackBar.open("User Save Successfully", "Success", {
              duration: 1000
            });
            this.companyForm.reset();
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
    this.service.updateCompany(this.companyForm.value)
    .subscribe({
      next:(res)=>{
        this._snackBar.open("Company Update Successfully", "Update", {
          duration: 1000
        });
        this.companyForm.reset();
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

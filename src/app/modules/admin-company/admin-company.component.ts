import { ApiServiceService } from './../../api-service.service';
import { Component, OnInit ,ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanydialogComponent } from './companydialog/companydialog.component';

@Component({
  selector: 'app-admin-company',
  templateUrl: './admin-company.component.html',
  styleUrls: ['./admin-company.component.css']
})
export class AdminCompanyComponent implements OnInit {
  displayedColumns: string[] = ['id','companyName', 'shortcutName', 'addressLine1', 'addressLine2', 'websiteUrl','isActive','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private service:ApiServiceService) { }

  ngOnInit(): void {
    this.getAllCompanies();
  }
  

  openDialog() {
    const dialogRef = this.dialog.open(CompanydialogComponent,{
      width:'50%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
         this.getAllCompanies();

      }
    });
  }
  

  editProduct(row:any){
    this.dialog.open(CompanydialogComponent,{
      width:'50%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
         this.getAllCompanies();

      }
    });

  }

 
  getAllCompanies(){
    this.service.getCompanyList()
    .subscribe({
      next:(res)=>{
        this.dataSource=new MatTableDataSource(res);
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort;
      },
      error:(err)=>{
        console.log("Error");
      }
      
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteCompany(id:number){

    this.service.deleteCompany(id)
    .subscribe({
      next:(res)=>{
        this._snackBar.open("Company Delete Successfully", "Delete", {
          duration: 1000
        });
        this.getAllCompanies();
      },
      error:()=>{
        this._snackBar.open("Delete Failed", "Failed");
      }
    })

  }

}

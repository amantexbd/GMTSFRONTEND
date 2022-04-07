import { AuthService } from 'src/app/shared/auth.service';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { Component, OnInit ,ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  // displayedColumns: string[] = ['userId','adminUserId','userFullName','username', 'email',  'phoneNumber','officeBranch','address','action'];
  displayedColumns: string[] = ['userFullName','username', 'email',  'phoneNumber','officeBranch','address','isActive','action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog,
    private service:AuthService,
    private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.getAllUsers();
  }
  openDialog() {
    const dialogRef = this.dialog.open(UserDialogComponent,{
      width:'50%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
         this.getAllUsers();

      }
    });
  }

  editUser(row:any){
    this.dialog.open(UserDialogComponent,{
      width:'50%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
         this.getAllUsers();

      }
    });

  }

 
  getAllUsers(){
    this.service.getUserList()
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

  deleteProduct(id:number){

    // this.service.deleteStudent(id)
    // .subscribe({
    //   next:(res)=>{
    //     this._snackBar.open("Student Delete Successfully", "Delete", {
    //       duration: 1000
    //     });
    //     this.getAllStudents();
    //   },
    //   error:()=>{
    //     this._snackBar.open("Delete Failed", "Failed");
    //   }
    // })

}
}

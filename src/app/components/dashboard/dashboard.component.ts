import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user.model';

import { Packer } from 'docx';
// import { saveAs } from 'file-saver';

import saveAs from 'file-saver';


import { experiences, education, skills, achievements } from './cv-data';
import { DocumentCreator } from './cv-generator';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: User;


  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUserData();
  }

  onDownload() {
    const documentCreator = new DocumentCreator();
    const doc = documentCreator.create([
      experiences,
      education,
      skills,
      achievements
    ]);

    Packer.toBlob(doc).then(blob => {
      console.log(blob);
      saveAs(blob, 'example.docx');
      console.log('Document created successfully');
    });
  }

  onLogout() {
    this.authService.SignOut();
  }
}

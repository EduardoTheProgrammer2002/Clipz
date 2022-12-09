import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  socialMedia = [
    {icon: 'fa-brands fa-facebook', link: 'https://www.facebook.com/edwardo.rodriguez.9480'},
    {icon:'fa-brands fa-instagram', link: 'https://www.instagram.com/eduardo.dr.k/'},
    {icon:'fa-brands fa-github', link: 'https://github.com/EduardoTheProgrammer2002'}, 
    {icon:'fa-brands fa-linkedin', link: 'https://www.linkedin.com/in/eduardo-rodr%C3%ADguez-583382234/'}
  ]

  constructor() { }

  ngOnInit(): void {
  }

}

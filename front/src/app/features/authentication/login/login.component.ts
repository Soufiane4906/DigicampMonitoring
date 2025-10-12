import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    MessageModule
  ],
  template: `
    <div class="login-container">
      <div class="login-wrapper">
        <div class="login-header">
          <i class="pi pi-chart-line logo-icon"></i>
          <h1>DigicampMonitoring</h1>
          <p>Gestion de projets et de ressources</p>
        </div>
        
        <p-card styleClass="login-card">
          <ng-template pTemplate="header">
            <div class="card-header">
              <h2>Connexion</h2>
              <p>Connectez-vous à votre espace</p>
            </div>
          </ng-template>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="field">
              <label for="username">
                <i class="pi pi-user"></i>
                Nom d'utilisateur
              </label>
              <input pInputText id="username" formControlName="username" 
                     placeholder="Entrez votre nom d'utilisateur" 
                     class="w-full" 
                     [class.p-invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" />
              @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
                <small class="p-error">
                  <i class="pi pi-exclamation-circle"></i>
                  Le nom d'utilisateur est requis
                </small>
              }
            </div>

            <div class="field">
              <label for="password">
                <i class="pi pi-lock"></i>
                Mot de passe
              </label>
              <p-password id="password" formControlName="password" 
                          placeholder="Entrez votre mot de passe" 
                          [feedback]="false" 
                          [toggleMask]="true"
                          styleClass="w-full"
                          [inputStyleClass]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched ? 'p-invalid' : ''" />
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <small class="p-error">
                  <i class="pi pi-exclamation-circle"></i>
                  Le mot de passe est requis
                </small>
              }
            </div>

            @if (errorMessage) {
              <p-message severity="error" [text]="errorMessage" styleClass="w-full error-message" />
            }

            <div class="actions">
              <p-button label="Se connecter" 
                        icon="pi pi-sign-in"
                        type="submit" 
                        [loading]="loading"
                        [disabled]="loginForm.invalid"
                        styleClass="w-full login-button" />
            </div>

            <div class="divider">
              <span>ou</span>
            </div>

            <div class="register-link">
              <span>Pas encore de compte ? </span>
              <a routerLink="/auth/register">
                <i class="pi pi-user-plus"></i>
                Créer un compte
              </a>
            </div>
          </form>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .login-container::before {
      content: '';
      position: absolute;
      width: 400px;
      height: 400px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      top: -100px;
      right: -100px;
      animation: float 6s ease-in-out infinite;
    }

    .login-container::after {
      content: '';
      position: absolute;
      width: 300px;
      height: 300px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      bottom: -50px;
      left: -50px;
      animation: float 8s ease-in-out infinite reverse;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    .login-wrapper {
      width: 100%;
      max-width: 480px;
      z-index: 1;
      animation: slideUp 0.5s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
      color: white;
    }

    .logo-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      display: block;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .login-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .login-header p {
      font-size: 1.1rem;
      opacity: 0.95;
      margin: 0;
    }

    ::ng-deep .login-card {
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      border-radius: 16px !important;
      overflow: hidden;
    }

    ::ng-deep .login-card .p-card-body {
      padding: 2rem;
    }

    .card-header {
      padding: 2rem 2rem 0 2rem;
      text-align: center;
    }

    .card-header h2 {
      font-size: 1.8rem;
      font-weight: 700;
      color: #333;
      margin: 0 0 0.5rem 0;
    }

    .card-header p {
      color: #666;
      margin: 0;
      font-size: 1rem;
    }

    .field {
      margin-bottom: 1.75rem;
    }

    label {
      display: block;
      margin-bottom: 0.6rem;
      font-weight: 600;
      color: #333;
      font-size: 0.95rem;
    }

    label i {
      margin-right: 0.5rem;
      color: #667eea;
    }

    ::ng-deep input.p-inputtext {
      border-radius: 8px;
      padding: 0.875rem;
      border: 2px solid #e0e0e0;
      transition: all 0.3s ease;
    }

    ::ng-deep input.p-inputtext:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }

    ::ng-deep input.p-inputtext.p-invalid {
      border-color: #ef4444;
    }

    .p-error {
      display: block;
      margin-top: 0.4rem;
      color: #ef4444;
      font-size: 0.875rem;
    }

    .p-error i {
      margin-right: 0.3rem;
    }

    ::ng-deep .error-message {
      margin-bottom: 1.5rem;
      border-radius: 8px;
    }

    .actions {
      margin-top: 2rem;
    }

    ::ng-deep .login-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 8px;
      padding: 0.875rem;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    ::ng-deep .login-button:not(:disabled):hover {
      background: linear-gradient(135deg, #5568d3 0%, #6a3f8c 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
    }

    .divider {
      text-align: center;
      margin: 1.5rem 0;
      position: relative;
    }

    .divider::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      height: 1px;
      background: #e0e0e0;
    }

    .divider span {
      background: white;
      padding: 0 1rem;
      color: #999;
      position: relative;
      z-index: 1;
      font-size: 0.875rem;
    }

    .register-link {
      text-align: center;
      margin-top: 1.5rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .register-link span {
      color: #666;
    }

    .register-link a {
      color: #667eea;
      font-weight: 600;
      text-decoration: none;
      margin-left: 0.3rem;
      transition: color 0.3s ease;
    }

    .register-link a:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    .register-link a i {
      margin-right: 0.3rem;
    }

    ::ng-deep .p-password {
      width: 100%;
    }

    ::ng-deep .p-password input {
      width: 100%;
      border-radius: 8px;
      padding: 0.875rem;
    }

    ::ng-deep .p-password-toggle-icon {
      color: #667eea;
    }

    @media (max-width: 576px) {
      .login-header h1 {
        font-size: 2rem;
      }

      .logo-icon {
        font-size: 3rem;
      }

      ::ng-deep .login-card .p-card-body {
        padding: 1.5rem;
      }

      .card-header {
        padding: 1.5rem 1.5rem 0 1.5rem;
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
          console.error('Login error:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}

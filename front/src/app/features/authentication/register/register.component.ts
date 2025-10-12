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
  selector: 'app-register',
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
    <div class="register-container">
      <div class="register-wrapper">
        <div class="register-header">
          <i class="pi pi-chart-line logo-icon"></i>
          <h1>Rejoignez-nous</h1>
          <p>Créez votre compte DigicampMonitoring</p>
        </div>
        
        <p-card styleClass="register-card">
          <ng-template pTemplate="header">
            <div class="card-header">
              <h2>Inscription</h2>
              <p>Commencez à gérer vos projets dès aujourd'hui</p>
            </div>
          </ng-template>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <div class="field">
                <label for="username">
                  <i class="pi pi-user"></i>
                  Nom d'utilisateur *
                </label>
                <input pInputText id="username" formControlName="username" 
                       placeholder="Choisissez un nom d'utilisateur" 
                       class="w-full"
                       [class.p-invalid]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched" />
                @if (registerForm.get('username')?.invalid && registerForm.get('username')?.touched) {
                  <small class="p-error">
                    <i class="pi pi-exclamation-circle"></i>
                    @if (registerForm.get('username')?.errors?.['required']) {
                      Le nom d'utilisateur est requis
                    }
                    @if (registerForm.get('username')?.errors?.['minlength']) {
                      Minimum 3 caractères requis
                    }
                  </small>
                }
              </div>

              <div class="field">
                <label for="email">
                  <i class="pi pi-envelope"></i>
                  Email *
                </label>
                <input pInputText type="email" id="email" formControlName="email" 
                       placeholder="votre@email.com" 
                       class="w-full"
                       [class.p-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" />
                @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                  <small class="p-error">
                    <i class="pi pi-exclamation-circle"></i>
                    @if (registerForm.get('email')?.errors?.['required']) {
                      L'email est requis
                    }
                    @if (registerForm.get('email')?.errors?.['email']) {
                      Format d'email invalide
                    }
                  </small>
                }
              </div>
            </div>

            <div class="form-row">
              <div class="field">
                <label for="firstName">
                  <i class="pi pi-id-card"></i>
                  Prénom
                </label>
                <input pInputText id="firstName" formControlName="firstName" 
                       placeholder="Votre prénom" class="w-full" />
              </div>

              <div class="field">
                <label for="lastName">
                  <i class="pi pi-id-card"></i>
                  Nom
                </label>
                <input pInputText id="lastName" formControlName="lastName" 
                       placeholder="Votre nom" class="w-full" />
              </div>
            </div>

            <div class="field">
              <label for="password">
                <i class="pi pi-lock"></i>
                Mot de passe *
              </label>
              <p-password id="password" formControlName="password" 
                          placeholder="Choisissez un mot de passe sécurisé" 
                          [toggleMask]="true"
                          [feedback]="true"
                          promptLabel="Entrez un mot de passe"
                          weakLabel="Faible"
                          mediumLabel="Moyen"
                          strongLabel="Fort"
                          styleClass="w-full"
                          [inputStyleClass]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched ? 'p-invalid' : ''" />
              @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                <small class="p-error">
                  <i class="pi pi-exclamation-circle"></i>
                  @if (registerForm.get('password')?.errors?.['required']) {
                    Le mot de passe est requis
                  }
                  @if (registerForm.get('password')?.errors?.['minlength']) {
                    Minimum 6 caractères requis
                  }
                </small>
              }
            </div>

            @if (errorMessage) {
              <p-message severity="error" [text]="errorMessage" styleClass="w-full error-message" />
            }

            <div class="actions">
              <p-button label="Créer mon compte" 
                        icon="pi pi-user-plus"
                        type="submit" 
                        [loading]="loading"
                        [disabled]="registerForm.invalid"
                        styleClass="w-full register-button" />
            </div>

            <div class="divider">
              <span>ou</span>
            </div>

            <div class="login-link">
              <span>Vous avez déjà un compte ? </span>
              <a routerLink="/auth/login">
                <i class="pi pi-sign-in"></i>
                Se connecter
              </a>
            </div>
          </form>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .register-container::before {
      content: '';
      position: absolute;
      width: 450px;
      height: 450px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 50%;
      top: -150px;
      left: -150px;
      animation: float 7s ease-in-out infinite;
    }

    .register-container::after {
      content: '';
      position: absolute;
      width: 350px;
      height: 350px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 50%;
      bottom: -100px;
      right: -100px;
      animation: float 9s ease-in-out infinite reverse;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) translateX(0px); }
      33% { transform: translateY(-20px) translateX(10px); }
      66% { transform: translateY(-10px) translateX(-10px); }
    }

    .register-wrapper {
      width: 100%;
      max-width: 650px;
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

    .register-header {
      text-align: center;
      margin-bottom: 2rem;
      color: white;
    }

    .logo-icon {
      font-size: 3.5rem;
      margin-bottom: 0.75rem;
      display: block;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .register-header h1 {
      font-size: 2.25rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .register-header p {
      font-size: 1rem;
      opacity: 0.95;
      margin: 0;
    }

    ::ng-deep .register-card {
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      border-radius: 16px !important;
      overflow: hidden;
    }

    ::ng-deep .register-card .p-card-body {
      padding: 2rem;
    }

    .card-header {
      padding: 2rem 2rem 0 2rem;
      text-align: center;
    }

    .card-header h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #333;
      margin: 0 0 0.5rem 0;
    }

    .card-header p {
      color: #666;
      margin: 0;
      font-size: 0.95rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .field {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.6rem;
      font-weight: 600;
      color: #333;
      font-size: 0.9rem;
    }

    label i {
      margin-right: 0.4rem;
      color: #667eea;
    }

    ::ng-deep input.p-inputtext {
      border-radius: 8px;
      padding: 0.75rem;
      border: 2px solid #e0e0e0;
      transition: all 0.3s ease;
      font-size: 0.95rem;
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
      font-size: 0.8rem;
    }

    .p-error i {
      margin-right: 0.3rem;
    }

    ::ng-deep .error-message {
      margin-bottom: 1.5rem;
      border-radius: 8px;
    }

    .actions {
      margin-top: 1.75rem;
    }

    ::ng-deep .register-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 8px;
      padding: 0.875rem;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    ::ng-deep .register-button:not(:disabled):hover {
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

    .login-link {
      text-align: center;
      margin-top: 1.5rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .login-link span {
      color: #666;
      font-size: 0.95rem;
    }

    .login-link a {
      color: #667eea;
      font-weight: 600;
      text-decoration: none;
      margin-left: 0.3rem;
      transition: color 0.3s ease;
    }

    .login-link a:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    .login-link a i {
      margin-right: 0.3rem;
    }

    ::ng-deep .p-password {
      width: 100%;
    }

    ::ng-deep .p-password input {
      width: 100%;
      border-radius: 8px;
      padding: 0.75rem;
    }

    ::ng-deep .p-password-toggle-icon {
      color: #667eea;
    }

    ::ng-deep .p-password-panel {
      border-radius: 8px;
      margin-top: 0.5rem;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }

      .register-header h1 {
        font-size: 1.875rem;
      }

      .logo-icon {
        font-size: 3rem;
      }

      ::ng-deep .register-card .p-card-body {
        padding: 1.5rem;
      }

      .card-header {
        padding: 1.5rem 1.5rem 0 1.5rem;
      }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: [''],
      lastName: ['']
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || 'Une erreur est survenue lors de l\'inscription';
          console.error('Register error:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}

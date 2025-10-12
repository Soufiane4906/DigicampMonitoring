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
      <p-card header="Inscription" subheader="Créez votre compte DigicampMonitoring">
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="username">Nom d'utilisateur *</label>
            <input pInputText id="username" formControlName="username" 
                   placeholder="Nom d'utilisateur" class="w-full" />
          </div>

          <div class="field">
            <label for="email">Email *</label>
            <input pInputText type="email" id="email" formControlName="email" 
                   placeholder="email@example.com" class="w-full" />
          </div>

          <div class="field">
            <label for="firstName">Prénom</label>
            <input pInputText id="firstName" formControlName="firstName" 
                   placeholder="Prénom" class="w-full" />
          </div>

          <div class="field">
            <label for="lastName">Nom</label>
            <input pInputText id="lastName" formControlName="lastName" 
                   placeholder="Nom" class="w-full" />
          </div>

          <div class="field">
            <label for="password">Mot de passe *</label>
            <p-password id="password" formControlName="password" 
                        placeholder="Mot de passe" 
                        [toggleMask]="true"
                        styleClass="w-full" />
          </div>

          @if (errorMessage) {
            <p-message severity="error" [text]="errorMessage" styleClass="w-full" />
          }

          <div class="actions">
            <p-button label="S'inscrire" 
                      type="submit" 
                      [loading]="loading"
                      [disabled]="registerForm.invalid"
                      styleClass="w-full" />
          </div>

          <div class="login-link">
            <span>Déjà un compte ? </span>
            <a routerLink="/auth/login">Se connecter</a>
          </div>
        </form>
      </p-card>
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
    }

    ::ng-deep .p-card {
      width: 100%;
      max-width: 500px;
    }

    .field {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .actions {
      margin-top: 2rem;
    }

    .login-link {
      text-align: center;
      margin-top: 1.5rem;
    }

    .login-link a {
      color: #667eea;
      font-weight: 600;
      text-decoration: none;
    }

    .login-link a:hover {
      text-decoration: underline;
    }

    ::ng-deep .p-password {
      width: 100%;
    }

    ::ng-deep .p-password input {
      width: 100%;
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
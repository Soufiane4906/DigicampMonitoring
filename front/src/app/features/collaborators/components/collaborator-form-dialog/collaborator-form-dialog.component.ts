import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipsModule } from 'primeng/chips';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { Collaborator } from '../../../../core/models/collaborator.model';
import { CollaboratorService } from '../../../../core/services/collaborator.service';

@Component({
  selector: 'app-collaborator-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    FileUploadModule,
    MessageModule,
    MultiSelectModule,
    ChipsModule,
    ToggleButtonModule
  ],
  template: `
    <p-dialog 
      [header]="isEditMode ? 'Modifier le collaborateur' : 'Nouveau collaborateur'"
      [(visible)]="visible"
      [modal]="true"
      [style]="{width: '700px'}"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onDialogHide()"
      styleClass="collaborator-dialog">
      
      <form [formGroup]="collaboratorForm" class="collaborator-form">
        <div class="form-grid">
          <!-- Photo -->
          <div class="form-field full-width photo-section">
            <label for="photo">Photo du collaborateur</label>
            <div class="photo-upload-container">
              @if (photoPreview) {
                <div class="photo-preview">
                  <img [src]="photoPreview" alt="Photo preview" />
                  <div class="photo-overlay">
                    <p-button 
                      icon="pi pi-times" 
                      [rounded]="true"
                      severity="danger"
                      size="small"
                      (onClick)="removePhoto()" />
                  </div>
                </div>
              } @else {
                <div class="photo-placeholder">
                  <i class="pi pi-user"></i>
                  <p>Aucune photo</p>
                </div>
              }
              <p-fileUpload
                mode="basic"
                name="photo"
                accept="image/*"
                [maxFileSize]="1000000"
                [auto]="true"
                chooseLabel="Choisir une photo"
                (onSelect)="onPhotoSelect($event)"
                styleClass="photo-upload-btn">
              </p-fileUpload>
            </div>
          </div>

          <!-- Nom -->
          <div class="form-field">
            <label for="firstName" class="required">Prénom</label>
            <input 
              pInputText 
              id="firstName" 
              formControlName="firstName"
              placeholder="Prénom du collaborateur"
              [class.error]="isFieldInvalid('firstName')" />
            @if (isFieldInvalid('firstName')) {
              <small class="error-message">
                <i class="pi pi-exclamation-circle"></i>
                Le prénom est requis
              </small>
            }
          </div>

          <div class="form-field">
            <label for="lastName" class="required">Nom</label>
            <input 
              pInputText 
              id="lastName" 
              formControlName="lastName"
              placeholder="Nom du collaborateur"
              [class.error]="isFieldInvalid('lastName')" />
            @if (isFieldInvalid('lastName')) {
              <small class="error-message">
                <i class="pi pi-exclamation-circle"></i>
                Le nom est requis
              </small>
            }
          </div>

          <!-- Email -->
          <div class="form-field full-width">
            <label for="email" class="required">Email professionnel</label>
            <input 
              pInputText 
              type="email"
              id="email" 
              formControlName="email"
              placeholder="prenom.nom@company.com"
              [class.error]="isFieldInvalid('email')" />
            @if (isFieldInvalid('email')) {
              <small class="error-message">
                <i class="pi pi-exclamation-circle"></i>
                {{ getEmailError() }}
              </small>
            }
          </div>

          <!-- Grade -->
          <div class="form-field">
            <label for="grade" class="required">Grade</label>
            <p-dropdown
              formControlName="grade"
              [options]="gradeOptions"
              placeholder="Sélectionnez un grade"
              [class.error]="isFieldInvalid('grade')">
            </p-dropdown>
            @if (isFieldInvalid('grade')) {
              <small class="error-message">
                <i class="pi pi-exclamation-circle"></i>
                Le grade est requis
              </small>
            }
          </div>

          <!-- Poste -->
          <div class="form-field">
            <label for="position" class="required">Poste / Rôle</label>
            <p-dropdown
              formControlName="position"
              [options]="positionOptions"
              placeholder="Sélectionnez un poste"
              [editable]="true"
              [class.error]="isFieldInvalid('position')">
            </p-dropdown>
            @if (isFieldInvalid('position')) {
              <small class="error-message">
                <i class="pi pi-exclamation-circle"></i>
                Le poste est requis
              </small>
            }
          </div>

          <!-- Site -->
          <div class="form-field">
            <label for="site" class="required">Site d'affectation</label>
            <p-dropdown
              formControlName="site"
              [options]="siteOptions"
              placeholder="Sélectionnez un site"
              [class.error]="isFieldInvalid('site')">
            </p-dropdown>
            @if (isFieldInvalid('site')) {
              <small class="error-message">
                <i class="pi pi-exclamation-circle"></i>
                Le site est requis
              </small>
            }
          </div>

          <!-- Disponibilité -->
          <div class="form-field">
            <label for="available">Disponibilité</label>
            <p-toggleButton
              formControlName="available"
              onLabel="Disponible"
              offLabel="Occupé"
              onIcon="pi pi-check"
              offIcon="pi pi-times"
              styleClass="w-full" />
          </div>

          <!-- Compétences -->
          <div class="form-field full-width">
            <label for="skills">Compétences techniques</label>
            <p-chips
              formControlName="skills"
              placeholder="Ajoutez des compétences (Ex: Java, Angular, Docker)"
              [max]="10"
              [addOnBlur]="true"
              [addOnTab]="true"
              styleClass="w-full">
            </p-chips>
            <small class="field-hint">
              <i class="pi pi-info-circle"></i>
              Appuyez sur Entrée ou Tab pour ajouter une compétence
            </small>
          </div>
        </div>

        @if (errorMessage) {
          <p-message severity="error" [text]="errorMessage" styleClass="w-full mt-3" />
        }
      </form>

      <ng-template pTemplate="footer">
        <div class="dialog-footer">
          <p-button 
            label="Annuler" 
            icon="pi pi-times"
            [outlined]="true"
            severity="secondary"
            (onClick)="onCancel()" />
          <p-button 
            [label]="isEditMode ? 'Mettre à jour' : 'Créer'"
            icon="pi pi-check"
            [loading]="loading"
            (onClick)="onSubmit()" />
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    ::ng-deep .collaborator-dialog {
      .p-dialog-header {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
      }

      .p-dialog-content {
        padding: 2rem;
      }
    }

    .collaborator-form {
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        &.full-width {
          grid-column: 1 / -1;
        }

        &.photo-section {
          margin-bottom: 1rem;
        }

        label {
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;

          &.required::after {
            content: ' *';
            color: #f44336;
          }
        }

        input, ::ng-deep .p-inputtext, ::ng-deep .p-dropdown {
          width: 100%;
        }

        .error {
          border-color: #f44336;
        }

        .error-message {
          color: #f44336;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.85rem;
          margin-top: -0.25rem;
        }

        .field-hint {
          color: #666;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: -0.25rem;

          i {
            color: #2196F3;
          }
        }
      }

      .photo-upload-container {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }

      .photo-preview {
        position: relative;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid #e9ecef;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photo-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        &:hover .photo-overlay {
          opacity: 1;
        }
      }

      .photo-placeholder {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;

        i {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        p {
          margin: 0;
          font-size: 0.85rem;
        }
      }

      ::ng-deep .photo-upload-btn {
        flex: 1;
      }

      ::ng-deep .p-togglebutton {
        width: 100%;
      }
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding-top: 1rem;
      border-top: 1px solid #e9ecef;
    }

    @media (max-width: 768px) {
      .collaborator-form .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CollaboratorFormDialogComponent implements OnInit {
  @Input() visible = false;
  @Input() collaborator?: Collaborator;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() collaboratorSaved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private collaboratorService = inject(CollaboratorService);

  collaboratorForm!: FormGroup;
  loading = false;
  errorMessage = '';
  photoPreview = '';
  photoFile: File | null = null;

  gradeOptions = ['A4', 'A5', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];
  
  positionOptions = [
    'Développeur',
    'Tech Lead',
    'Architecte',
    'Product Owner',
    'Scrum Master',
    'QA Engineer',
    'DevOps Engineer',
    'Business Analyst',
    'UI/UX Designer'
  ];

  siteOptions = ['Casa', 'Rabat', 'Indifférent'];

  get isEditMode(): boolean {
    return !!this.collaborator;
  }

  ngOnInit(): void {
    this.initForm();
    if (this.collaborator) {
      this.populateForm();
    }
  }

  initForm(): void {
    this.collaboratorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      grade: ['', Validators.required],
      position: ['', Validators.required],
      site: ['', Validators.required],
      available: [true],
      skills: [[]],
      photo: ['']
    });
  }

  populateForm(): void {
    if (this.collaborator) {
      this.collaboratorForm.patchValue({
        firstName: this.collaborator.firstName,
        lastName: this.collaborator.lastName,
        email: this.collaborator.email,
        grade: this.collaborator.grade,
        position: this.collaborator.position,
        site: this.collaborator.site,
        available: this.collaborator.available,
        skills: this.collaborator.skills || []
      });
      
      if (this.collaborator.photo) {
        this.photoPreview = this.collaborator.photo;
      }
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.collaboratorForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getEmailError(): string {
    const emailControl = this.collaboratorForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'L\'email est requis';
    }
    if (emailControl?.hasError('email')) {
      return 'Format d\'email invalide';
    }
    return '';
  }

  onPhotoSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      this.photoFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.photoPreview = '';
    this.photoFile = null;
    this.collaboratorForm.patchValue({ photo: '' });
  }

  onSubmit(): void {
    if (this.collaboratorForm.invalid) {
      Object.keys(this.collaboratorForm.controls).forEach(key => {
        this.collaboratorForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formValue = this.collaboratorForm.value;
    const collaboratorData = {
      ...formValue,
      photo: this.photoPreview
    };

    const request = this.isEditMode
      ? this.collaboratorService.updateCollaborator(this.collaborator!.id, collaboratorData)
      : this.collaboratorService.createCollaborator(collaboratorData);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.collaboratorSaved.emit();
        this.closeDialog();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Une erreur est survenue';
      }
    });
  }

  onCancel(): void {
    this.closeDialog();
  }

  onDialogHide(): void {
    this.resetForm();
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  resetForm(): void {
    this.collaboratorForm.reset({ available: true, skills: [] });
    this.photoPreview = '';
    this.photoFile = null;
    this.errorMessage = '';
  }
}

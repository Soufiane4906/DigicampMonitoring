import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { EditorModule } from 'primeng/editor';
import { MessageModule } from 'primeng/message';
import { Project } from '../../../../core/models/project.model';
import { ProjectService } from '../../../../core/services/project.service';

@Component({
  selector: 'app-project-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule,
    DropdownModule,
    FileUploadModule,
    EditorModule,
    MessageModule
  ],
  template: `
    <p-dialog 
      [header]="isEditMode ? 'Modifier le projet' : 'Nouveau projet'"
      [(visible)]="visible"
      [modal]="true"
      [style]="{width: '800px'}"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onDialogHide()"
      styleClass="project-dialog">
      
      <form [formGroup]="projectForm" class="project-form">
        <div class="form-grid">
          <!-- Nom du projet -->
          <div class="form-field full-width">
            <label for="name" class="required">Nom du projet</label>
            <input 
              pInputText 
              id="name" 
              formControlName="name"
              placeholder="Entrez le nom du projet"
              [class.error]="isFieldInvalid('name')" />
            @if (isFieldInvalid('name')) {
              <small class="error-message">
                <i class="pi pi-exclamation-circle"></i>
                Le nom est requis
              </small>
            }
          </div>

          <!-- Logo du projet -->
          <div class="form-field full-width">
            <label for="logo">Logo du projet</label>
            <p-fileUpload
              mode="basic"
              name="logo"
              accept="image/*"
              [maxFileSize]="1000000"
              [auto]="true"
              chooseLabel="Choisir une image"
              (onSelect)="onLogoSelect($event)"
              styleClass="logo-upload">
            </p-fileUpload>
            @if (logoPreview) {
              <div class="logo-preview">
                <img [src]="logoPreview" alt="Logo preview" />
                <p-button 
                  icon="pi pi-times" 
                  [rounded]="true"
                  severity="danger"
                  size="small"
                  (onClick)="removeLogo()" />
              </div>
            }
          </div>

          <!-- Description -->
          <div class="form-field full-width">
            <label for="description" class="required">Description / Objectifs</label>
            <p-editor 
              formControlName="description"
              [style]="{'height':'200px'}"
              placeholder="Décrivez les objectifs du projet...">
            </p-editor>
            @if (isFieldInvalid('description')) {
              <small class="error-message">
                <i class="pi pi-exclamation-circle"></i>
                La description est requise
              </small>
            }
          </div>

          <!-- Dates -->
          <div class="form-field">
            <label for="startDate" class="required">Date de début prévue</label>
            <p-calendar
              formControlName="startDate"
              dateFormat="dd/mm/yy"
              [showIcon]="true"
              placeholder="Sélectionnez une date"
              [class.error]="isFieldInvalid('startDate')">
            </p-calendar>
            @if (isFieldInvalid('startDate')) {
              <small class="error-message">
                <i class="pi pi-exclamation-circle"></i>
                La date de début est requise
              </small>
            }
          </div>

          <div class="form-field">
            <label for="endDate">Date de fin prévue</label>
            <p-calendar
              formControlName="endDate"
              dateFormat="dd/mm/yy"
              [showIcon]="true"
              placeholder="Sélectionnez une date">
            </p-calendar>
          </div>

          <!-- Statut -->
          <div class="form-field full-width">
            <label for="status" class="required">Statut du projet</label>
            <p-dropdown
              formControlName="status"
              [options]="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Sélectionnez un statut"
              [class.error]="isFieldInvalid('status')">
            </p-dropdown>
            @if (isFieldInvalid('status')) {
              <small class="error-message">
                <i class="pi pi-exclamation-circle"></i>
                Le statut est requis
              </small>
            }
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
    ::ng-deep .project-dialog {
      .p-dialog-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .p-dialog-content {
        padding: 2rem;
      }
    }

    .project-form {
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

        label {
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;

          &.required::after {
            content: ' *';
            color: #f44336;
          }
        }

        input, ::ng-deep .p-inputtext, ::ng-deep .p-dropdown, ::ng-deep .p-calendar {
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
      }

      ::ng-deep .logo-upload {
        .p-button {
          width: 100%;
        }
      }

      .logo-preview {
        position: relative;
        margin-top: 1rem;
        display: inline-block;

        img {
          max-width: 200px;
          max-height: 150px;
          border-radius: 8px;
          border: 2px solid #e9ecef;
        }

        p-button {
          position: absolute;
          top: -8px;
          right: -8px;
        }
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
      .project-form .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProjectFormDialogComponent implements OnInit {
  @Input() visible = false;
  @Input() project?: Project;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() projectSaved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);

  projectForm!: FormGroup;
  loading = false;
  errorMessage = '';
  logoPreview = '';
  logoFile: File | null = null;

  statusOptions = [
    { label: 'En cours', value: 'EN_COURS', color: '#2196F3' },
    { label: 'Terminé', value: 'TERMINE', color: '#4CAF50' },
    { label: 'En pause', value: 'EN_PAUSE', color: '#FF9800' },
    { label: 'Annulé', value: 'ANNULE', color: '#F44336' },
    { label: 'Planifié', value: 'PLANIFIE', color: '#9C27B0' }
  ];

  get isEditMode(): boolean {
    return !!this.project;
  }

  ngOnInit(): void {
    this.initForm();
    if (this.project) {
      this.populateForm();
    }
  }

  initForm(): void {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      status: ['EN_COURS', Validators.required],
      logo: ['']
    });
  }

  populateForm(): void {
    if (this.project) {
      this.projectForm.patchValue({
        name: this.project.name,
        description: this.project.description,
        startDate: new Date(this.project.startDate),
        endDate: this.project.endDate ? new Date(this.project.endDate) : null,
        status: this.project.status.value
      });
      
      if (this.project.logo) {
        this.logoPreview = this.project.logo;
      }
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.projectForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onLogoSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      this.logoFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeLogo(): void {
    this.logoPreview = '';
    this.logoFile = null;
    this.projectForm.patchValue({ logo: '' });
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      Object.keys(this.projectForm.controls).forEach(key => {
        this.projectForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formValue = this.projectForm.value;
    const projectData = {
      ...formValue,
      logo: this.logoPreview,
      status: this.statusOptions.find(s => s.value === formValue.status)
    };

    const request = this.isEditMode
      ? this.projectService.updateProject(this.project!.id, projectData)
      : this.projectService.createProject(projectData);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.projectSaved.emit();
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
    this.projectForm.reset({ status: 'EN_COURS' });
    this.logoPreview = '';
    this.logoFile = null;
    this.errorMessage = '';
  }
}

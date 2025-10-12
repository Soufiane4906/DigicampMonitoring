import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="image-upload-container">
      <div 
        class="drop-zone"
        [class.drag-over]="isDragging"
        [class.has-image]="imagePreview"
        (drop)="onDrop($event)"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (click)="fileInput.click()">
        
        @if (imagePreview) {
          <div class="image-preview">
            <img [src]="imagePreview" [alt]="label" />
            <div class="image-overlay">
              <p-button 
                icon="pi pi-times" 
                [rounded]="true"
                severity="danger"
                size="small"
                (onClick)="removeImage($event)" />
              <p-button 
                icon="pi pi-pencil" 
                [rounded]="true"
                severity="info"
                size="small"
                class="ml-2" />
            </div>
          </div>
        } @else {
          <div class="upload-prompt">
            <i class="pi pi-cloud-upload"></i>
            <h4>{{ label }}</h4>
            <p>Glissez-déposez ou cliquez pour sélectionner</p>
            <span class="file-types">
              Formats acceptés : JPG, PNG, SVG (max {{ maxSizeMB }}MB)
            </span>
          </div>
        }
      </div>

      <input
        #fileInput
        type="file"
        [accept]="accept"
        (change)="onFileSelect($event)"
        style="display: none" />
    </div>
  `,
  styles: [`
    .image-upload-container {
      width: 100%;
      
      .drop-zone {
        position: relative;
        width: 100%;
        min-height: 250px;
        border: 2px dashed #d1d5db;
        border-radius: 12px;
        background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;

        &:hover {
          border-color: #667eea;
          background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.1),
                      0 10px 10px -5px rgba(102, 126, 234, 0.04);
        }

        &.drag-over {
          border-color: #667eea;
          background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
          border-width: 3px;
          transform: scale(1.02);
        }

        &.has-image {
          border-style: solid;
          border-color: #10b981;
          background: #ffffff;
          min-height: 300px;
        }

        .upload-prompt {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          min-height: 250px;
          padding: 2rem;
          text-align: center;

          i {
            font-size: 3.5rem;
            color: #667eea;
            margin-bottom: 1rem;
            animation: float 3s ease-in-out infinite;
          }

          h4 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 0.5rem 0;
          }

          p {
            font-size: 0.95rem;
            color: #6b7280;
            margin: 0 0 1rem 0;
          }

          .file-types {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
          }
        }

        .image-preview {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;

          img {
            max-width: 100%;
            max-height: 280px;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                        0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }

          .image-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.3s ease;
            display: flex;
            gap: 0.5rem;
          }

          &:hover .image-overlay {
            opacity: 1;
          }
        }
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    @media (max-width: 768px) {
      .image-upload-container {
        .drop-zone {
          min-height: 200px;

          &.has-image {
            min-height: 250px;
          }

          .upload-prompt {
            min-height: 200px;
            padding: 1rem;

            i {
              font-size: 2.5rem;
            }

            h4 {
              font-size: 1rem;
            }

            p {
              font-size: 0.85rem;
            }
          }

          .image-preview {
            min-height: 250px;

            img {
              max-height: 220px;
            }
          }
        }
      }
    }
  `]
})
export class ImageUploadComponent {
  @Input() label = 'Télécharger une image';
  @Input() accept = 'image/*';
  @Input() maxSizeMB = 2;
  @Input() imagePreview = '';
  @Output() imageSelected = new EventEmitter<{ file: File; preview: string }>();
  @Output() imageRemoved = new EventEmitter<void>();

  isDragging = false;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File): void {
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    // Vérifier la taille
    const maxSizeBytes = this.maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert(`La taille du fichier ne doit pas dépasser ${this.maxSizeMB}MB`);
      return;
    }

    // Lire le fichier
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const preview = e.target?.result as string;
      this.imageSelected.emit({ file, preview });
    };
    reader.readAsDataURL(file);
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.imageRemoved.emit();
  }
}

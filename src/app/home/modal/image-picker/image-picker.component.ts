import { Component, OnInit, ElementRef, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}


@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker', { static: false }) filPickerRef: ElementRef;
  @Output() imagePick = new EventEmitter<string | File>();
  @Input() showPreview;

  selectedImage;
  usePicker = false;
  faCamera = faCamera;

  constructor(private platform: Platform) { }

  ngOnInit() {
    if (this.platform.is('mobile') && !this.platform.is('hybrid') || this.platform.is('desktop')) {
      this.usePicker = true;
    }
    if (this.showPreview) {
      this.selectedImage = this.showPreview;
    }
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filPickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 80,
      source: CameraSource.Prompt,
      correctOrientation: true,
      width: 600,
      resultType: CameraResultType.Base64
    }).then(image => {
      let imageData;
      const imageFile = image.base64String;
      try {
        imageData = base64toBlob(imageFile.replace('data:image/jpeg;base64', ''), 'image/jpeg');
      } catch (error) {
        return;
      }
      const fr = new FileReader();
      fr.readAsDataURL(imageData);
      fr.onload = () => {
        this.selectedImage = fr.result.toString();
      };
      this.imagePick.emit(image.base64String);
    }).catch(err => {
      if (this.usePicker) {
        this.filPickerRef.nativeElement.click();
      }
      return false;
    });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }
}


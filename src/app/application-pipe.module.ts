import { NgModule } from '@angular/core';
import { MinuteSecondsPipe } from '../pipe/minute-seconds.pipe';

@NgModule({
    imports: [
        // dep modules
    ],
    declarations: [
        MinuteSecondsPipe
    ],
    exports: [
        MinuteSecondsPipe
    ]
})
export class ApplicationPipesModule { }

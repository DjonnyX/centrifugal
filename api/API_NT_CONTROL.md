# Centrifugal

## [NtControlModule](https://github.com/DjonnyX/centrifugal/blob/main/src/lib/common/directives/nt-control/nt-control.module.ts)

### NtControl directive

To correctly handle interactive elements within a list, such as buttons, you need to use the NtControl directive.

```ts
import { NtListModule, NtControlModule } from 'centrifugal';

@Component({
  selector: 'example',
  imports: [NtListModule, NtControlModule],
})
```

```html
<ng-template #itemRenderer let-data="data" let-config="config" let-api="api">
  @if (data) {
    <div ntControl (onVirtualClick)="api.select(data.id, true)">
      <span>{{data.name}}</span>
    </div>
  }
</ng-template>
```

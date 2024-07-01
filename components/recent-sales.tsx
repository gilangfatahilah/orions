import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://utfs.io/f/fc1267f7-dde6-4020-9506-045f646c0ee2-n92lk7.jpg" alt="Avatar" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Edogawa Ranpo</p>
          <p className="text-sm text-muted-foreground">
            edogawa@mailnesia.com
          </p>
        </div>
        <div className="ml-auto font-medium">+$1,999.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="https://utfs.io/f/fc1267f7-dde6-4020-9506-045f646c0ee2-n92lk7.jpg" alt="Avatar" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Edogawa Ranpo</p>
          <p className="text-sm text-muted-foreground">edogawa@mailnesia.com</p>
        </div>
        <div className="ml-auto font-medium">+$39.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://utfs.io/f/e648639c-d83c-42ad-9f96-2db827a66eca-gvpywe.jpg" alt="Avatar" />
          <AvatarFallback>OD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Osamu Dazai</p>
          <p className="text-sm text-muted-foreground">
            osamu@mailnesia.com
          </p>
        </div>
        <div className="ml-auto font-medium">+$299.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://utfs.io/f/d10676ba-3582-4d7f-bca0-d7c042008d42-wx3uem.jpg" alt="Avatar" />
          <AvatarFallback>AN</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Atsushi Nakajima</p>
          <p className="text-sm text-muted-foreground">atsushi@mailnesia.com</p>
        </div>
        <div className="ml-auto font-medium">+$99.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://utfs.io/f/d10676ba-3582-4d7f-bca0-d7c042008d42-wx3uem.jpg" alt="Avatar" />
          <AvatarFallback>AN</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Atsushi Nakajima</p>
          <p className="text-sm text-muted-foreground">atsushi@mailnesia.com</p>
        </div>
        <div className="ml-auto font-medium">+$39.00</div>
      </div>
    </div>
  );
}

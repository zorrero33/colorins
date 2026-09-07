export function Logo({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <div className={`${className} relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border flex items-center justify-center`}>
      {/* Usamos la ruta directa a la carpeta public */}
      <img 
        src="/logo-colorins.jpg" 
        alt="COLORINS Onda" 
        className="size-full object-contain scale-125" 
      />
    </div>
  );
}
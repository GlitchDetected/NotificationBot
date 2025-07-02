export function Scrollwheel() {
    return (
        <div className="flex flex-col items-center space-x-2">
            <div className="animate-scroll rounded-lg rotate-180 md:rounded-3xl md:rotate-0">
                <div className="animate-scroll-wheel" />
            </div>
            <span className="hidden md:block text-lg font-medium mt-2 text-red-600">Keep scrolling</span>
        </div>
    );
}
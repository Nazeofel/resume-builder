import Link from 'next/link'

interface BuilderHeaderProps {
    isSaving: boolean
    lastSaved: Date | null
    onSave: () => void
    onDownload: (format: 'pdf' | 'word' | 'text') => void
}

export function BuilderHeader({ isSaving, lastSaved, onSave, onDownload }: BuilderHeaderProps) {
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-color/50 px-6 md:px-10 py-3 bg-background-light sticky top-0 z-20">
            <div className="flex items-center gap-4 text-text-main">
                <div className="size-4">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M39.7107 13.2608L40.0732 12.2742L39.7107 13.2608ZM41.835 22.2146L42.8302 22.4381L41.835 22.2146ZM39.7107 34.7392L40.0732 35.7258L39.7107 34.7392ZM8.28928 34.7392L7.92678 35.7258L8.28928 34.7392ZM6.16502 22.2146L5.16978 22.4381L6.16502 22.2146ZM8.28928 13.2608L7.92678 12.2742L8.28928 13.2608ZM39.3482 14.2474C37.4285 13.5762 35.4156 13.2143 33.3571 13.2143V11.2143C35.6235 11.2143 37.8405 11.6094 39.9512 12.3408L39.3482 14.2474ZM33.3571 13.2143H14.6429V11.2143H33.3571V13.2143ZM14.6429 13.2143C12.5844 13.2143 10.5715 13.5762 8.65178 14.2474L8.06538 12.3408C10.1761 11.6094 12.3931 11.2143 14.6429 11.2143V13.2143ZM8.65178 14.2474C4.38652 15.7085 1.21429 19.6241 1.21429 24.214H-0.785713C-0.785713 18.6762 3.00066 14.0058 7.92678 12.2742L8.65178 14.2474ZM1.21429 24.214C1.21429 28.804 4.38652 32.7195 8.65178 34.1806L8.06538 36.0872C3.00066 34.3556 -0.785713 29.6852 -0.785713 24.214H1.21429ZM8.65178 34.1806C10.5715 34.8518 12.5844 35.2137 14.6429 35.2137V37.2137C12.3931 37.2137 10.1761 36.8186 8.06538 36.0872L8.65178 34.1806ZM14.6429 35.2137H33.3571V37.2137H14.6429V35.2137ZM33.3571 35.2137C35.4156 35.2137 37.4285 34.8518 39.3482 34.1806L39.9512 36.0872C37.8405 36.8186 35.6235 37.2137 33.3571 37.2137V35.2137ZM39.3482 34.1806C43.6135 32.7195 46.7857 28.804 46.7857 24.214H48.7857C48.7857 29.6852 44.9993 34.3556 40.0732 36.0872L39.3482 34.1806ZM46.7857 24.214C46.7857 19.6241 43.6135 15.7085 39.3482 14.2474L39.9512 12.3408C44.9993 14.0058 48.7857 18.6762 48.7857 24.214H46.7857Z"
                            fill="currentColor"
                        />
                    </svg>
                </div>
                <Link href="/dashboard">
                    <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">ResumeBuilder</h2>
                </Link>
            </div>
            <div className="flex flex-1 justify-end gap-8">
                <div className="hidden md:flex items-center gap-9">
                    <Link href="/dashboard" className="text-sm font-medium leading-normal">
                        Dashboard
                    </Link>
                    {/* <Link href="/templates" className="text-sm font-medium leading-normal">
                        Templates
                    </Link> */}
                </div>
                <div className="flex gap-2 items-center">
                    {lastSaved && (
                        <span className="text-xs text-text-subtle hidden md:block mr-2">
                            {isSaving ? 'Saving...' : `Saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                        </span>
                    )}
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-border-color/60 text-text-main text-sm font-bold leading-normal tracking-[0.015em] hover:bg-border-color/80 transition-colors disabled:opacity-50"
                    >
                        <span className="truncate">{isSaving ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                        onClick={() => onDownload('pdf')}
                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                    >
                        <span className="truncate">Download</span>
                    </button>
                </div>
                <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                    style={{
                        backgroundImage: 'url("https://cdn.usegalileo.ai/stability/e2060837-caa0-48f0-a90e-f776319037f7.png")'
                    }}
                ></div>
            </div>
        </header>
    )
}

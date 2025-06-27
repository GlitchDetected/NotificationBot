export default function Codeblock({ children }) {
    return (
        <span 
        className='bg-red-900 p-1 rounded-md 
        dark:text-neutral-100 text-neutral-900 font-mono text-sx0'
        >
            {children}
        </span>
    );
}
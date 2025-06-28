export function CheckHeading(str) {
    return /^(\*)(\*)(.*)\*$/.test(str)
}

export function ReplceHeading(str){
    return str.replace(/^(\*)(\*)|(\*)$/g,'')
}
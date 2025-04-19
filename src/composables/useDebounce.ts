export default {
    //自定义节流操作
    preventReClick: {
        mounted(el: { addEventListener: (arg0: string, arg1: () => void) => void; disabled: boolean }, binding: { value: any }) {
            el.addEventListener('click', () => {
                if (!el.disabled) {
                    el.disabled = true
                    setTimeout(() => {
                        el.disabled = false
                    }, binding.value || 2000) //2000ms间隔时间
                }
            })
        }
    }
}
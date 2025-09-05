import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export default function useDanerceHook(elementRef: Ref<{
    style: any;
    getElement: () => HTMLElement
} | null>) {
    const active = ref(true);
    const dom = ref<HTMLElement | null>(null);
    const originalTransform = ref(''); // 新增：存储原始transform值
    const originalBoxShadow = ref(''); // 新增：存储原始box-shadow值

    const distanceBetween = (p1x: number, p1y: number, p2x: number, p2y: number): number => {
        const dx = p1x - p2x;
        const dy = p1y - p2y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    // 新增：恢复原始位置的方法
    const resetPosition = () => {
        if (dom.value) {
            dom.value.style.transform = originalTransform.value;
            dom.value.style.boxShadow = originalBoxShadow.value;
            dom.value.style.transition = 'all 0.3s ease'; // 平滑过渡
        }
    };

    const handleMouseMove = (event: MouseEvent) => {
        dom.value = elementRef.value?.getElement() || null;

        if (!dom.value) return;

        // 首次调用时保存原始样式
        if (!originalTransform.value) {
            originalTransform.value = dom.value.style.transform || 'none';
            originalBoxShadow.value = dom.value.style.boxShadow || 'none';
        }

        if (!active.value) return;
        if (typeof dom.value.getBoundingClientRect !== 'function') {
            console.error('Invalid DOM element:', dom.value);
            return;
        }

        const radius = Math.max(dom.value.offsetWidth * 0.75, dom.value.offsetHeight * 0.75);
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const domRect = dom.value.getBoundingClientRect();
        const bx = domRect.left + domRect.width / 2;
        const by = domRect.top + domRect.height / 2;

        const dist = distanceBetween(event.clientX, event.clientY, bx, by);
        const angle = Math.atan2(event.clientY - by, event.clientX - bx);

        const ox = (-1 * Math.cos(angle) * Math.max(radius - dist, 0) * windowWidth) / 1440;
        const oy = (-1 * Math.sin(angle) * Math.max(radius - dist, 0) * windowHeight) / 900;
        const rx = oy / 2;
        const ry = -ox / 2;

        dom.value.style.transition = 'all 0.1s ease';
        dom.value.style.transform = `translate(${ox}px,${oy}px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        dom.value.style.boxShadow = `0px ${Math.abs(oy)}px ${(Math.abs(oy) / radius) * 60
            }px rgba(0,0,0,0.15)`;
    };

    onMounted(() => {
        dom.value = elementRef.value?.getElement() || null;
        document.addEventListener('mousemove', handleMouseMove);
    });

    onUnmounted(() => {
        document.removeEventListener('mousemove', handleMouseMove);
    });

    const setDanceshow = (show: boolean) => {
        active.value = show;
        if (!show) {
            resetPosition(); // 暂停时恢复原位
        }
    };

    return {
        setDanceshow,
        resetPosition // 暴露resetPosition方法
    };
}
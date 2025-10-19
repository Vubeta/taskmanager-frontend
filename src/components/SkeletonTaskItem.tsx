export default function SkeletonTaskItem() {
    return (
        <li className="flex items-center justify-between p-3 border rounded bg-white" aria-hidden="true">
            <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse" />
                <div className="space-y-2">
                    <div className="w-48 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>
            <div className="flex gap-2">
                <div className="w-10 h-6 bg-gray-200 rounded animate-pulse" />
            </div>
        </li>
    );
}

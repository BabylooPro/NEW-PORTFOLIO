import { TreeViewElement } from "@/components/ui/file-tree";
import { WhatIDoData } from "../constants/what-i-do-data";

export const fileTreeData: TreeViewElement[] = [
    {
        id: "development",
        name: "Development",
        children: [
            {
                id: "backend",
                name: "Backend",
                children: [
                    {
                        id: "controllers",
                        name: "Controllers",
                        children: [{
                            id: WhatIDoData[0].file,
                            name: WhatIDoData[0].file,
                            isSelectable: true
                        }]
                    },
                    {
                        id: "services",
                        name: "Services",
                        children: [{
                            id: WhatIDoData[1].file,
                            name: WhatIDoData[1].file,
                            isSelectable: true
                        }]
                    },
                    {
                        id: "middlewares",
                        name: "Middlewares",
                        children: [{
                            id: WhatIDoData[2].file,
                            name: WhatIDoData[2].file,
                            isSelectable: true
                        }]
                    },
                ]
            },
            {
                id: "software",
                name: "Software Engineering",
                children: [
                    {
                        id: WhatIDoData[3].file,
                        name: WhatIDoData[3].file,
                        isSelectable: true
                    }
                ]
            },
            {
                id: "frontend",
                name: "Frontend",
                children: [
                    {
                        id: WhatIDoData[4].file,
                        name: WhatIDoData[4].file,
                        isSelectable: true
                    }
                ]
            },
            {
                id: "fullstack",
                name: "Fullstack",
                children: [
                    {
                        id: WhatIDoData[5].file,
                        name: WhatIDoData[5].file,
                        isSelectable: true
                    }
                ]
            },
            {
                id: "devops",
                name: "DevOps",
                children: [
                    {
                        id: WhatIDoData[6].file,
                        name: WhatIDoData[6].file,
                        isSelectable: true
                    }
                ]
            }
        ]
    }
]; 

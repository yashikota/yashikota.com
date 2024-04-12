import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface GalleryComponentProps {
    thumbnail: string;
    title: string;
    date: string;
    tags: string[];
    instagram: string;
    details: {
        f: string;
        focal_length: string;
        exposure: string;
        iso: string;
        camera: string;
        lens: string;
        location: string;
    };
}

export function GalleryComponent(props: GalleryComponentProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

    return (
        <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
            <DialogTrigger asChild>
                <Card
                    className="lg:w-4/5 mx-auto my-5 hover:bg-gray-100 hover:cursor-pointer"
                    onClick={toggleDialog}
                >
                    <CardContent className="p-1 flex justify-center">
                        <img
                            src={props.thumbnail}
                            alt={props.title}
                            className="aspect-ratio object-cover max-h-[65vh]"
                        />
                    </CardContent>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardDescription className="text-lg text-muted-foreground">
                                {props.date}
                            </CardDescription>
                            {props.instagram !== "" && (
                                <a
                                    href={props.instagram}
                                    target="_blank"
                                    rel="noopener"
                                    className="hover:text-gray-400 mr-2"
                                >
                                    <InstagramLogoIcon width="25" height="25" />
                                </a>
                            )}
                        </div>
                        <CardTitle className="text-black">
                            {props.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="flex items-center flex-wrap">
                            {props.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-lg mr-2 text-sky-400 hover:text-sky-700"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </CardDescription>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[90%] overflow-hidden flex flex-col space-y-4 overflow-y-scroll">
                <DialogHeader>
                    <DialogDescription>{props.date}</DialogDescription>
                    <DialogTitle className="text-2xl font-semibold leading-none tracking-tight">
                        {props.title}
                    </DialogTitle>
                </DialogHeader>
                <img src={props.thumbnail} alt={props.title} />
                <DialogFooter>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>F</TableCell>
                                <TableCell>{props.details.f}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Focal Length</TableCell>
                                <TableCell>
                                    {props.details.focal_length}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Exposure</TableCell>
                                <TableCell>{props.details.exposure}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>ISO</TableCell>
                                <TableCell>{props.details.iso}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Camera</TableCell>
                                <TableCell>{props.details.camera}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Lens</TableCell>
                                <TableCell>{props.details.lens}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Location</TableCell>
                                <TableCell>{props.details.location}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

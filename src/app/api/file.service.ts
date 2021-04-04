import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { scan } from "rxjs/operators";

export interface FileResponse {
    name: string;
    originalName: string;
}

export interface Upload {
	progress: number;
	state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
	response?: FileResponse;
}

function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
	return event.type === HttpEventType.Response;
}

function isHttpProgressEvent(
	event: HttpEvent<unknown>
): event is HttpProgressEvent {
	return (
		event.type === HttpEventType.DownloadProgress ||
		event.type === HttpEventType.UploadProgress
	);
}

const calculateState = (upload: Upload, event: HttpEvent<unknown>): Upload => {
	if (isHttpProgressEvent(event)) {
		return {
			progress: event.total
				? Math.round((100 * event.loaded) / event.total)
				: upload.progress,
			state: 'IN_PROGRESS',
		};
	}
	if (isHttpResponse(event)) {
		return {
			progress: 100,
			state: 'DONE',
			response: event.body as any
		};
	}
	return upload;
}

@Injectable()
export class FileService {

    constructor(
        private readonly httpClient: HttpClient
    ) {}

    public uploadFile(formData: FormData, onProgress?: (progress: number) => void): Promise<FileResponse> {
        const initialState: Upload = { state: 'PENDING', progress: 0 };
		return new Promise((resolve) => {
            let subscription: Subscription = this.httpClient.post("/api/file", formData, {
				reportProgress: true,
				observe: "events"
			}).pipe(scan(calculateState, initialState)).subscribe(tick => {
				switch(tick.state) {
					case "DONE":
						resolve(tick.response);
                        if (subscription) {
                            subscription.unsubscribe();
                        }
						break;
					case "IN_PROGRESS":
						if (onProgress) {
							onProgress(tick.progress);
						}
						break;
				}
			});
		});
    }

}
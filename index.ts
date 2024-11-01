// server.ts
import Docker from 'dockerode';
import type { Request, Response } from 'express';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Docker
const docker = new Docker();

// Middleware
app.use(express.json());

// Health check route
app.get('/', (req: Request, res: Response) => {
    res.send('Web IDE Backend is running');
});

// Endpoint to submit code for execution
app.post('/execute', async (req: Request, res: Response): Promise<void> => {
    const { language, code } = req.body;

    try {
        // Set up Docker container command based on language
        let cmd: string[];
        switch (language) {
            case 'python':
                cmd = [
                    '/bin/bash',
                    '-c',
                    `echo "${code.replace(/"/g, '\\"')}" | python3`,
                ];
                break;
            case 'c':
                cmd = [
                    '/bin/bash',
                    '-c',
                    `echo "${code.replace(
                        /"/g,
                        '\\"'
                    )}" > code.c && gcc code.c -o code && ./code`,
                ];
                break;
            case 'cpp':
                cmd = [
                    '/bin/bash',
                    '-c',
                    `echo "${code.replace(
                        /"/g,
                        '\\"'
                    )}" > code.cpp && g++ code.cpp -o code && ./code`,
                ];
                break;
            case 'java':
                cmd = [
                    '/bin/bash',
                    '-c',
                    `echo "${code.replace(
                        /"/g,
                        '\\"'
                    )}" > Main.java && javac Main.java && java Main`,
                ];
                break;
            default:
                res.status(400).json({ error: 'Unsupported language' });
                return;
        }

        // Create and start Docker container
        const container = await docker.createContainer({
            Image: 'code-execution-image', // Use your built image name
            Cmd: cmd,
            Tty: false,
            AttachStdout: true,
            AttachStderr: true,
        });
        await container.start();

        // Capture logs
        const logs = await container.logs({ stdout: true, stderr: true });
        await container.stop();
        await container.remove();

        // Send logs back to the client
        res.json({ output: logs.toString() });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            error: `Execution failed: ${(error as Error).message}`,
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

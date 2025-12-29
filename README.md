# Audiobook Generator

A local, privacy-focused web application to generate audiobooks from EPUB or Text files using the [Kokoro TTS](https://huggingface.co/hexgrad/Kokoro-82M) model.

## Features

*   **Local Processing**: All audio generation happens locally on your machine using Docker. No data is sent to the cloud.
*   **High Performance**: Processes multiple text chunks in parallel for significantly faster audiobook generation.
*   **Format Support**:
    *   **Input**: EPUB (`.epub`) and Text (`.txt`) files, or direct text input.
    *   **Output**: M4B Audiobooks (`.m4b`) with chapters, or standard MP3 (`.mp3`) files.
*   **Voice Selection**: Choose from various high-quality Kokoro voices (e.g., `af_heart`, `af_sky`, `am_adam`).
*   **Speed Control**: Adjust the playback speed (0.5x to 2.0x).
*   **Real-time Progress**: View detailed progress as parallel workers generate audio chunks.
*   **Stop Generation**: Ability to cancel the process at any time.

## Prerequisites

*   [Docker](https://www.docker.com/) and Docker Compose installed on your machine.

## Quick Start (Docker)

This is the recommended way to run the application.

1.  **Clone the repository** (if you haven't already).

2.  **Start the services**:
    Run the following command from the root of the project (where `docker-compose.yml` is located):

    ```bash
    docker-compose up --build
    ```

    This will start two containers:
    *   `kokoro-tts`: The text-to-speech backend service.
    *   `audiobook-web-ui`: The Next.js web interface.

    *Note: The first run might take a few minutes to download the Docker images and the Kokoro model weights.*

3.  **Access the App**:
    Open your browser and navigate to:
    [http://localhost:3000](http://localhost:3000)

4.  **Generate an Audiobook**:
    *   Upload an EPUB or TXT file, or switch to the "Text Input" tab to paste text.
    *   Select a voice and speed.
    *   Choose your output format (M4B or MP3).
    *   Click "Generate Audiobook".
    *   Once complete, a download button will appear.

## Development (Running Locally)

If you want to develop the web UI without Docker (connecting to the Dockerized Kokoro backend):

1.  **Start the Kokoro Backend**:
    ```bash
    docker-compose up kokoro-tts
    ```

2.  **Install Dependencies**:
    Navigate to the `web-ui` directory:
    ```bash
    cd web-ui
    npm install
    ```

3.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

4.  The app will be available at `http://localhost:3000`.
    *Note: You will need `ffmpeg` installed on your host machine for the audio merging to work in this mode.*

#!/bin/bash

# Change directory to the location of your Android project
cd \Users\vasud\AndroidStudioProjects\MyApplication2


# Clean the project
./gradlew clean

# Build the APK
./gradlew assembleDebug

# Path to the generated APK
APK_PATH=app/build/outputs/apk/debug/app-debug.apk

# Output directory
OUTPUT_DIR=/path/to/output/directory

# Copy the APK to the output directory
cp $APK_PATH $OUTPUT_DIR

echo "APK has been built and copied to $OUTPUT_DIR"

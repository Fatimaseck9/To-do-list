pipeline {
    agent any

    tools {
        nodejs 'node 20'
    }

    environment {
        SONAR_SCANNER_HOME = tool 'SonarQubeScanner'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/Fatimaseck9/To-do-list.git'
            }
        }

        stage('Install') {
            steps {
                bat 'npm cache clean --force'
                bat 'npm ci --no-optional'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    bat "${env.SONAR_SCANNER_HOME}\\bin\\sonar-scanner.bat"
                }
            }
        }

        stage('Approve Deployment') {
            input {
                message "Do you want to proceed for deployment?"
            }
            steps {
                bat 'echo Deploying into Server'
            }
        }
    }

    post {
        aborted {
            echo "Pipeline aborted"
        }
        failure {
            echo "Pipeline failed"
        }
        success {
            echo "Pipeline succeeded"
        }
    } 
}

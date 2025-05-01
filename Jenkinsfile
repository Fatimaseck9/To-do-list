pipeline {
    agent any
    tools {
        nodejs 'node 20'  
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/Fatimaseck9/To-do-list.git'
            }
        }

        stage('Install') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test -- --coverage --watchAll=false'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                bat 'sonar-scanner'
            }
        }

        stage('Approve Deployment') {
            input {
                message "Do you want to proceed for deployment?"
            }
            steps {
                sh 'echo "Deploying into Server"'
            }
        }
    }
    post {
        aborted {
            echo "Sending message to agent: Pipeline aborted"
        }
        failure {
            echo "Sending message to agent: Pipeline failed"
        }
        success {
            echo "Sending message to agent: Pipeline succeeded"
        }
    }
}
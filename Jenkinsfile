pipeline {
    agent any
    tools {
        nodejs 'node 20'  
        jdk 'jdk17' 
    }
       environment {
        SONAR_SCANNER_HOME = tool 'Sonar'
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
        // stage('Test') {
             //steps {
            
                 //bat 'npm test'
            // }
       // }
        stage('SonarQube Analysis') {
            steps {
                 withSonarQubeEnv('Sonar') {
                         bat "${env.SONAR_SCANNER_HOME}\\bin\\sonar-scanner.bat"
                    }
            }
        }
        stage('Approve Deployment') {
            input {
                message "Do you want to proceed for deployment?"
            }
            steps {
                
                bat 'echo "Deploying into Server"'
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

import React, { Component } from 'react'
import "./ErrorBoundary.css";

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props)

        this.state = {
            hasError: false
        }
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true
        }
    }
    componentDidCatch(error, errorInfo) {
        console.log('Error:', error)
        console.log('Error Info:', errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <main className="error-boundary">
                    <h2>Something went wrong!</h2>
                </main>
            )
        }
        return (
            this.props.children
        )
    }
}

export default ErrorBoundary
from setuptools import setup, find_packages

setup(
    name="vaify",
    version="0.1.0",
    description="Python SDK for the Vaify AI Agent Reputation API",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    author="Vaify",
    license="MIT",
    packages=find_packages(),
    python_requires=">=3.9",
    install_requires=["requests>=2.28.0"],
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
)

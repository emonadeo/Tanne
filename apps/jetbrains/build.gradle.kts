fun properties(key: String) = project.findProperty(key).toString()

plugins {
	// Java support
	id("java")
	// Kotlin support
	id("org.jetbrains.kotlin.jvm") version "1.7.10"
	// Gradle IntelliJ Plugin
	id("org.jetbrains.intellij") version "1.9.0"
	// Gradle Changelog Plugin
	id("org.jetbrains.changelog") version "1.3.1"
}

group = properties("pluginGroup")
version = properties("pluginVersion")

// Configure project's dependencies
repositories {
	mavenCentral()
}

// Set the JVM language level used to compile sources and generate files - Java 11 is required since 2020.3
kotlin {
	jvmToolchain {
		languageVersion.set(JavaLanguageVersion.of(11))
	}
}

// Configure Gradle IntelliJ Plugin - read more: https://plugins.jetbrains.com/docs/intellij/tools-gradle-intellij-plugin.html
intellij {
	pluginName.set(properties("pluginName"))
	version.set(properties("platformVersion"))
}

// Configure Gradle Changelog Plugin - read more: https://github.com/JetBrains/gradle-changelog-plugin
changelog {
	version.set(properties("pluginVersion"))
	groups.set(emptyList())
}

sourceSets {
	main {
		resources {
			exclude("**/*.tpl.*")
		}
	}
}

tasks {
	wrapper {
		gradleVersion = properties("gradleVersion")
	}

	patchPluginXml {
		version.set(properties("pluginVersion"))
		sinceBuild.set(properties("pluginSinceBuild"))
		untilBuild.set("") // No until version

		// Get the latest available change notes from the changelog file
		changeNotes.set(provider {
			changelog.run {
				getOrNull(properties("pluginVersion")) ?: getLatest()
			}.toHTML()
		})
	}

	// signPlugin {
	//     certificateChain.set(System.getenv("CERTIFICATE_CHAIN"))
	//     privateKey.set(System.getenv("PRIVATE_KEY"))
	//     password.set(System.getenv("PRIVATE_KEY_PASSWORD"))
	// }

	publishPlugin {
		dependsOn("patchChangelog")
		token.set(System.getenv("PUBLISH_TOKEN"))
		// pluginVersion is based on the SemVer (https://semver.org) and supports pre-release labels, like 2.1.7-alpha.3
		// Specify pre-release label to publish the plugin in a custom Release Channel automatically. Read more:
		// https://plugins.jetbrains.com/docs/intellij/deployment.html#specifying-a-release-channel
		channels.set(listOf(properties("pluginVersion").split('-').getOrElse(1) { "default" }.split('.').first()))
	}
}
